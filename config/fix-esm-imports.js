/**
 * @file 为 ESM 产物（lib-esm）的相对 import/export 补全 `.js` 扩展名
 * @author kekee000(kekee000@gmail.com)
 *
 * Node 原生 ESM 要求相对说明符必须带扩展名，而 tsc 不会改写说明符，
 * 因此在 `build:esm` 之后运行本脚本，按磁盘上的真实文件补全扩展名。
 */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../lib-esm');

// 已带这些扩展名的说明符不再处理
const KNOWN_EXT = /\.(js|mjs|cjs|json|node)$/;

/**
 * 递归收集目录下的 .js 文件
 *
 * @param {string} dir 目录
 * @return {string[]} 文件路径列表
 */
function collectJsFiles(dir) {
    const result = [];
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            result.push(...collectJsFiles(full));
        }
        else if (name.endsWith('.js')) {
            result.push(full);
        }
    }
    return result;
}

/**
 * 依据磁盘真实文件，把相对说明符解析为带扩展名的形式
 *
 * @param {string} fileDir 当前文件所在目录
 * @param {string} spec 相对说明符，如 ./ttf/font
 * @return {string} 补全后的说明符，无法解析时原样返回
 */
function resolveSpecifier(fileDir, spec) {
    if (KNOWN_EXT.test(spec)) {
        return spec;
    }
    if (fs.existsSync(path.resolve(fileDir, spec + '.js'))) {
        return spec + '.js';
    }
    if (fs.existsSync(path.resolve(fileDir, spec, 'index.js'))) {
        return spec.replace(/\/$/, '') + '/index.js';
    }
    console.warn('[fix-esm-imports] 无法解析: %s (in %s)', spec, fileDir);
    return spec;
}

function fixFile(file) {
    const fileDir = path.dirname(file);
    const source = fs.readFileSync(file, 'utf8');
    // 覆盖 `from '...'`、动态 `import('...')` 两种相对说明符
    const pattern = /(\bfrom\s*|\bimport\s*\(\s*)(['"])(\.[^'"]+)\2/g;
    const next = source.replace(pattern, (match, prefix, quote, spec) => {
        return prefix + quote + resolveSpecifier(fileDir, spec) + quote;
    });
    if (next !== source) {
        fs.writeFileSync(file, next);
        return true;
    }
    return false;
}

function main() {
    if (!fs.existsSync(ROOT)) {
        console.error('[fix-esm-imports] 未找到 lib-esm，先执行 build:esm');
        process.exit(1);
    }
    const files = collectJsFiles(ROOT);
    let changed = 0;
    for (const file of files) {
        if (fixFile(file)) {
            changed++;
        }
    }
    console.log('[fix-esm-imports] 处理 %d 个文件，改写 %d 个', files.length, changed);
}

main();
