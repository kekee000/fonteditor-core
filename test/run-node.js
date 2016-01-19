/**
 * @file test node interface
 * @author mengke01(kekee000@gmail.com)
 */

var fs = require('fs');


var files = fs.readdirSync('./node-spec');
// 测试node的接口
files.forEach(function (file) {
    if (file.match(/\.spec\.js$/)) {
        console.log(file);
        require(__dirname + '/node-spec/' + file);
    }
});
