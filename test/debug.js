const fs = require('fs');
const Font = require('../').Font;

const buffer = fs.readFileSync('/System/Library/Fonts/NewYork.ttf');
const font = Font.create(buffer, {
    type: 'ttf'
});
console.log(font.get()['OS/2']);

const font1 = Font.create(font.write({type: 'ttf'}), {
    type: 'ttf'
});

console.log(font1.get()['OS/2']);