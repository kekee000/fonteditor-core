/**
 * @file data reader
 * @author mengke01(kekee000@gmail.com)
 */

import path from 'path';
import fs from 'fs';

const DATA_PATH = path.resolve(__dirname, '../data');

export function readData(filePath) {
    filePath = path.resolve(DATA_PATH, filePath);
    if (filePath.endsWith('.svg')) {
        return fs.readFileSync(filePath, 'utf8');
    }
    let buffer = fs.readFileSync(filePath);
    let length = buffer.length;
    let view = new DataView(new ArrayBuffer(length), 0, length);
    for (let i = 0, l = length; i < l; i++) {
        view.setUint8(i, buffer[i], false);
    }
    return view.buffer;
}
