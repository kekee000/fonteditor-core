/**
 * @file 入口文件
 * @author mengke01(kekee000@gmail.com)
 */
import {loadFile} from 'fonteditor-core/common/ajaxFile';
import fonteditor from 'fonteditor-core/main';


async function main() {
    let buffer = await loadFile('./demo/test/fonteditor.ttf');
    let font = new fonteditor.Font(buffer);
    console.log('ttf', font.data);

    buffer = await loadFile('./demo/test/fonteditor.eot');
    font = new fonteditor.Font(buffer, {type: 'eot'});
    console.log('eot', font.data);

    buffer = await loadFile('./demo/test/fonteditor.woff');
    font = new fonteditor.Font(buffer, {type: 'woff', inflate: window.pako.inflate});
    console.log('woff', font.data);

    buffer = await loadFile('./demo/test/fonteditor.svg', 'text');
    font = new fonteditor.Font(buffer, {type: 'svg'});
    console.log('svg', font.data);

    buffer = await loadFile('./demo/test/BalladeContour.otf');
    font = new fonteditor.Font(buffer, {type: 'otf'});
    console.log('otf', font.data);
}

main();
