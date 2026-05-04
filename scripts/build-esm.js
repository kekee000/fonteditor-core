const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const esmDir = path.join(rootDir, 'esm');

const FROM_SPECIFIER_PATTERN = /((?:import|export)\s[\s\S]*?\sfrom\s*)(['"])(\.{1,2}\/[^'"]+)\2/g;
const SIDE_EFFECT_SPECIFIER_PATTERN = /(import\s*)(['"])(\.{1,2}\/[^'"]+)\2/g;

function ensureDirectory(dirPath) {
    fs.mkdirSync(dirPath, {recursive: true});
}

function rewriteSpecifier(relativeFilePath, specifier) {
    if (
        (relativeFilePath === 'main.js' || relativeFilePath === 'main.esm.js')
        && specifier === '../woff2/index'
    ) {
        return './woff2/index.js';
    }

    if (relativeFilePath.startsWith('ttf/') && specifier === '../../woff2/index') {
        return '../woff2/index.js';
    }

    if (!path.extname(specifier)) {
        return `${specifier}.js`;
    }

    return specifier;
}

function rewriteModuleSpecifiers(source, relativeFilePath) {
    const replacer = (match, prefix, quote, specifier) => {
        const rewrittenSpecifier = rewriteSpecifier(relativeFilePath, specifier);
        return `${prefix}${quote}${rewrittenSpecifier}${quote}`;
    };

    let rewrittenSource = source
        .replace(FROM_SPECIFIER_PATTERN, replacer)
        .replace(SIDE_EFFECT_SPECIFIER_PATTERN, replacer);

    if (relativeFilePath === 'main.js') {
        rewrittenSource = rewrittenSource.replace(
            /\nif \(typeof exports !== 'undefined'\) \{\n    \/\/ eslint-disable-next-line import\/no-commonjs\n    module\.exports = modules;\n\}\s*$/,
            '\n'
        );
    }

    return rewrittenSource;
}

function getEsmDOMParserSource() {
    return `/**
 * @file DOM解析器，兼容node端和浏览器端
 * @author mengke01(kekee000@gmail.com)
 */

/* eslint-disable no-undef */
const browserDOMParser = typeof window !== 'undefined' && window.DOMParser
    ? window.DOMParser
    : null;

let cachedNodeDOMParser;
let hasResolvedNodeDOMParser = false;

function getNodeRequire() {
    if (
        typeof process !== 'undefined'
        && typeof process.getBuiltinModule === 'function'
    ) {
        const nodeModule = process.getBuiltinModule('module');
        if (nodeModule && typeof nodeModule.createRequire === 'function') {
            return nodeModule.createRequire(import.meta.url);
        }
    }

    return null;
}

export function getDOMParser() {
    if (browserDOMParser) {
        return browserDOMParser;
    }

    if (!hasResolvedNodeDOMParser) {
        hasResolvedNodeDOMParser = true;
        const nodeRequire = getNodeRequire();

        if (nodeRequire) {
            try {
                cachedNodeDOMParser = nodeRequire('@xmldom/xmldom').DOMParser;
            }
            catch (exp) {
                cachedNodeDOMParser = null;
            }
        }
        else {
            cachedNodeDOMParser = null;
        }
    }

    return cachedNodeDOMParser;
}

export default browserDOMParser;
`;
}

function getEsmWoff2Source() {
    return `/**
 * @file woff2 wasm build of google woff2
 * thanks to woff2-asm
 * https://github.com/alimilhim/woff2-wasm
 * @author mengke01(kekee000@gmail.com)
 */

function getNodeRequire() {
    if (
        typeof process !== 'undefined'
        && typeof process.getBuiltinModule === 'function'
    ) {
        const nodeModule = process.getBuiltinModule('module');
        if (nodeModule && typeof nodeModule.createRequire === 'function') {
            return nodeModule.createRequire(import.meta.url);
        }
    }

    return null;
}

function loadBrowserModuleLoader(scriptUrl) {
    return new Promise((resolve, reject) => {
        const existingGlobal = globalThis.Module;
        const script = document.createElement('script');

        script.async = true;
        script.src = scriptUrl;
        script.onload = () => {
            const moduleLoader = globalThis.Module;
            if (!moduleLoader) {
                reject(new Error('Failed to load woff2 module loader'));
                return;
            }

            resolve(moduleLoader);

            if (existingGlobal === undefined) {
                delete globalThis.Module;
            }
            else {
                globalThis.Module = existingGlobal;
            }
        };
        script.onerror = () => {
            reject(new Error('Failed to load woff2 module loader'));
        };

        document.head.appendChild(script);
    });
}

async function loadWoff2ModuleLoader() {
    const nodeRequire = getNodeRequire();
    if (nodeRequire) {
        return nodeRequire('../../woff2/woff2.js');
    }

    if (typeof document !== 'undefined') {
        const scriptUrl = new URL('../../woff2/woff2.js', import.meta.url).href;
        return loadBrowserModuleLoader(scriptUrl);
    }

    throw new Error('woff2 module loader is not available in this environment');
}

function convertFromVecToUint8Array(vector) {
    const arr = [];
    for (let i = 0, l = vector.size(); i < l; i++) {
        arr.push(vector.get(i));
    }
    return new Uint8Array(arr);
}

const woff2Module = {
    woff2Module: null,

    isInited() {
        return (
            this.woff2Module && this.woff2Module.woff2Enc && this.woff2Module.woff2Dec
        );
    },

    async init(wasmUrl) {
        if (this.woff2Module) {
            return this;
        }

        let moduleLoaderConfig = null;
        if (typeof window !== 'undefined') {
            const wasmHref = wasmUrl || new URL('../../woff2/woff2.wasm', import.meta.url).href;
            moduleLoaderConfig = {
                locateFile(path) {
                    if (path.endsWith('.wasm')) {
                        return wasmHref;
                    }
                    return path;
                },
            };
        }
        else {
            const wasmHref = wasmUrl || new URL('../../woff2/woff2.wasm', import.meta.url);
            moduleLoaderConfig = {
                wasmBinaryFile: wasmHref.pathname,
            };
        }

        const woff2ModuleLoader = await loadWoff2ModuleLoader();

        await new Promise((resolve) => {
            const woffModule = woff2ModuleLoader(moduleLoaderConfig);
            woffModule.onRuntimeInitialized = () => {
                this.woff2Module = woffModule;
                resolve();
            };
        });

        return this;
    },

    encode(ttfBuffer) {
        const buffer = new Uint8Array(ttfBuffer);
        const woffbuff = this.woff2Module.woff2Enc(buffer, buffer.byteLength);
        return convertFromVecToUint8Array(woffbuff);
    },

    decode(woff2Buffer) {
        const buffer = new Uint8Array(woff2Buffer);
        const ttfbuff = this.woff2Module.woff2Dec(buffer, buffer.byteLength);
        return convertFromVecToUint8Array(ttfbuff);
    },
};

export default woff2Module;
`;
}

function writeEsmFile(relativeFilePath, content) {
    const targetPath = path.join(esmDir, relativeFilePath);
    ensureDirectory(path.dirname(targetPath));
    fs.writeFileSync(targetPath, content);
}

function copySourceDirectory(currentDir) {
    const entries = fs.readdirSync(currentDir, {withFileTypes: true});

    entries.forEach((entry) => {
        const sourcePath = path.join(currentDir, entry.name);
        const relativePath = path.relative(srcDir, sourcePath).replace(/\\/g, '/');

        if (entry.isDirectory()) {
            copySourceDirectory(sourcePath);
            return;
        }

        if (!entry.isFile()) {
            return;
        }

        if (relativePath === 'common/DOMParser.js') {
            writeEsmFile(relativePath, getEsmDOMParserSource());
            return;
        }

        const source = fs.readFileSync(sourcePath, 'utf8');
        writeEsmFile(relativePath, rewriteModuleSpecifiers(source, relativePath));
    });
}

function buildEsm() {
    fs.rmSync(esmDir, {recursive: true, force: true});
    ensureDirectory(esmDir);

    copySourceDirectory(srcDir);
    writeEsmFile('package.json', JSON.stringify({type: 'module'}, null, 2) + '\n');
    writeEsmFile('woff2/index.js', getEsmWoff2Source());
}

buildEsm();