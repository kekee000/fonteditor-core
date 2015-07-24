var path = require( 'path' );
var amd2module = require('./tool/amd2module');

exports.input =  path.resolve(__dirname, './src');
exports.output = path.resolve(__dirname, './node');


exports.getProcessors = function () {

    var NodeModuleProcessor = {
        name: 'NodeModuleProcessor',
        files: [
            '*.js',
        ],
        process: function(file, processContext, callback) {

            var depth = new Array(file.path.split('/').length).join('../');

            if (file.data.indexOf('define') >= 0) {
                file.setData(amd2module(file.data, depth));
            }
            callback();
        }
    }

    return [
        NodeModuleProcessor
    ];
};

exports.exclude = [
    ".svn",
    "*.conf",
    "*.sh",
    "*.bat",
    "*.md",
    "demo",
    "node_modules",
    "agent/*",
    "node",
    "mock",
    "test",
    "edp-*",
    "output",
    ".DS_Store",
    ".gitignore",
    "package.json",
];

exports.injectProcessor = function ( processors ) {
    for ( var key in processors ) {
        global[ key ] = processors[ key ];
    }
};

