/**
 * @file nodejs build
 * @author mengke01(kekee000@gmail.com)
 */
const fs = require('fs');
const content = fs.readFileSync('./woff2.js', 'utf-8');
const newContent = content.replace(/require\("([\w+/]+)"\)/g, ($0, $1) => {
    return 'require(["' + $1 + '"].join(""))';
});
fs.writeFileSync('./woff2.js', newContent);
console.log('replace module done');