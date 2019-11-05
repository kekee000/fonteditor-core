/**
 * @file webpack 配置
 * @author mengke01(kekee000@gmail.com)
 */

const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DEMO_DIR = path.resolve(__dirname, '../demo');

function getEntries() {
    let files = fs.readdirSync(DEMO_DIR + '/js');
    let entries = {};
    for (let file of files) {
        if (file.endsWith('.js')) {
            let entryScript = file.replace('.js', '');
            entries[entryScript] = './demo/js/' + file;
        }
    }
    return entries;
}


function getHtmlPages() {
    let files = fs.readdirSync(DEMO_DIR);
    let pages = [];
    for (let file of files) {
        if (file.endsWith('.html')) {
            let entryScript = file.replace('.html', '');
            pages.push(
                new HtmlWebpackPlugin({
                    title: file,
                    filename: 'demo/' + file,
                    template: path.resolve(DEMO_DIR, file),
                    chunks: [entryScript]
                })
            );
        }
    }
    return pages;
}

module.exports = {
    entry: getEntries(),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            'fonteditor-core': path.resolve(__dirname, '../src')
        }
    },
    externals: {
        jquery: 'window.jQuery',
        $: 'window.jQuery'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'index page',
            filename: 'index.html',
            template: path.resolve(DEMO_DIR, 'index.html'),
            chunks: ['index']
        }),
        ...getHtmlPages()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
};
