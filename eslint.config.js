import jsdoc from 'eslint-plugin-jsdoc';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import mochaPlugin from 'eslint-plugin-mocha';
import globals from 'globals';
import js from '@eslint/js';

export default [
    js.configs.recommended,
    mochaPlugin.configs.flat.recommended,
    jsdoc.configs['flat/recommended'],
    eslintPluginUnicorn.configs['flat/recommended'],
    {
        files: ['**/*.js'],
        plugins: {
            jsdoc,
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.nodeBuiltin,
                ...globals.mocha,
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly',
            },
        },
        ignores: ['/node_modules/**'],
        rules: {
            'unicorn/prefer-module': 'off',
            'unicorn/numeric-separators-style': 'off',
            'jsdoc/check-line-alignment': 2,
            'jsdoc/require-jsdoc': [
                'warn',
                {
                    require: {
                        FunctionDeclaration: true,
                        MethodDefinition: true,
                        ClassDeclaration: true,
                        ArrowFunctionExpression: false,
                        FunctionExpression: true,
                    },
                },
            ],
            'jsdoc/require-param-type': 'error',
            'jsdoc/tag-lines': ['warn', 'any', { startLines: 1 }],
            'jsdoc/no-undefined-types': 'error',
            'jsdoc/valid-types': 'off',
        },

        settings: {
            jsdoc: {
                mode: 'jsdoc',
                preferredTypes: {
                    array: 'Array',
                    'array.<>': '[]',
                    'Array.<>': '[]',
                    'array<>': '[]',
                    'Array<>': '[]',
                    Object: 'object',
                    'object.<>': 'Object.<>',
                    'object<>': 'Object.<>',
                    'Object<>': 'Object.<>',
                    set: 'Set',
                    'set.<>': 'Set.<>',
                    'set<>': 'Set.<>',
                    'Set<>': 'Set.<>',
                    promise: 'Promise',
                    'promise.<>': 'Promise.<>',
                    'promise<>': 'Promise.<>',
                    'Promise<>': 'Promise.<>',
                },
            },
        },
    },
    eslintConfigPrettier,
];
