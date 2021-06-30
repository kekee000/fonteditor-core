// eslint-disable-next-line import/no-commonjs
module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true,
        'mocha': true
    },
    'extends': ['eslint:recommended', 'plugin:import/recommended'],
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module'
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'eqeqeq': [
            'error',
            'always',
            {
                'null': 'ignore'
            }
        ],
        'key-spacing': [
            2,
            {
                beforeColon: false,
                afterColon: true
            }
        ],
        'no-multi-spaces': 2,
        'class-methods-use-this': 0
    },
    'overrides': [
        {
            files: [
                'test/**/*.js'
            ],
            rules: {
                'import/no-unresolved': 0
            }
        }
    ]
};
