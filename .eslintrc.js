// eslint-disable-next-line import/no-commonjs
module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true,
        'mocha': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended'
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module'
    },
    'plugins': ['@typescript-eslint'],
    'settings': {
        'import/resolver': {
            'typescript': {
                'project': ['./tsconfig.json', './tsconfig.test.json']
            },
            'node': true
        }
    },
    'rules': {
        'indent': [
            'error',
            4,
            {
                'SwitchCase': 1
            }
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
        'class-methods-use-this': 0,
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        'no-prototype-builtins': 'off',
        'no-empty': 'off',
        'no-cond-assign': 'off',
        'no-fallthrough': 'off',
        'no-constant-condition': 'off',
        'no-useless-escape': 'off',
        'no-control-regex': 'off',
        'no-self-assign': 'off',
        'no-redeclare': 'off',
        'no-case-declarations': 'off',
        'import/no-named-as-default-member': 'off'
    },
    'overrides': [
        {
            files: [
                'test/**/*.{js,ts}'
            ],
            rules: {
                'import/no-unresolved': 0
            }
        }
    ]
};
