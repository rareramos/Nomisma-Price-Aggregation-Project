module.exports = {
  'parser': 'babel-eslint', // https://github.com/babel/babel-eslint
  'plugins': [
    'react',
    'import',
  ],
  'env': {
    'browser': true,
    'node': true,
    'mocha': true,
    'es6': true,
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: [
          'node_modules',
          'src',
        ],
        'extensions': [
          '.js',
          '.jsx',
          '.ts',
          '.tsx'
        ]
      },
      react: {
        version: 'detect',
      }
    },
  },
  'globals': {
    'LOANS_API_ENDPOINT': true,
    'API_URI': true,
    'USE_OWN_API': true,
  },
  'parserOptions': {
    'ecmaVersion': 9,
    'ecmaFeatures': {
      'arrowFunctions': true,
      'blockBindings': true,
      'classes': true,
      'defaultParams': true,
      'destructuring': true,
      'forOf': true,
      'generators': false,
      'modules': true,
      'objectLiteralComputedProperties': true,
      'objectLiteralDuplicateProperties': false,
      'objectLiteralShorthandMethods': true,
      'objectLiteralShorthandProperties': true,
      'spread': true,
      'superInFunctions': true,
      'templateStrings': true,
      'jsx': true,
    },
  },
  'rules': {
    'no-var': 2,                     // http://eslint.org/docs/rules/no-var
    'prefer-const': 2,               // http://eslint.org/docs/rules/prefer-const

    /**
     * Variables
     */
    'no-shadow': 2,                  // http://eslint.org/docs/rules/no-shadow
    'no-shadow-restricted-names': 2, // http://eslint.org/docs/rules/no-shadow-restricted-names
    'no-undef': 2,                   // http://eslint.org/docs/rules/no-undef
    'no-unused-vars': [2, {          // http://eslint.org/docs/rules/no-unused-vars
      'vars': 'local',
      'args': 'after-used',
    } ],
    'no-use-before-define': 2,       // http://eslint.org/docs/rules/no-use-before-define

    /**
     * Possible errors
     */
    'no-cond-assign': [2, 'always' ], // http://eslint.org/docs/rules/no-cond-assign
    'no-console': 1,                 // http://eslint.org/docs/rules/no-console
    'no-debugger': 1,                // http://eslint.org/docs/rules/no-debugger
    'no-alert': 1,                   // http://eslint.org/docs/rules/no-alert
    'no-constant-condition': 1,      // http://eslint.org/docs/rules/no-constant-condition
    'no-dupe-keys': 2,               // http://eslint.org/docs/rules/no-dupe-keys
    'no-duplicate-case': 2,          // http://eslint.org/docs/rules/no-duplicate-case
    'no-empty': 2,                   // http://eslint.org/docs/rules/no-empty
    'no-ex-assign': 2,               // http://eslint.org/docs/rules/no-ex-assign
    'no-extra-boolean-cast': 0,      // http://eslint.org/docs/rules/no-extra-boolean-cast
    'no-extra-semi': 2,              // http://eslint.org/docs/rules/no-extra-semi
    'no-func-assign': 2,             // http://eslint.org/docs/rules/no-func-assign
    'no-inner-declarations': 2,      // http://eslint.org/docs/rules/no-inner-declarations
    'no-invalid-regexp': 2,          // http://eslint.org/docs/rules/no-invalid-regexp
    'no-irregular-whitespace': 2,    // http://eslint.org/docs/rules/no-irregular-whitespace
    'no-obj-calls': 2,               // http://eslint.org/docs/rules/no-obj-calls
    'no-sparse-arrays': 2,           // http://eslint.org/docs/rules/no-sparse-arrays
    'no-unreachable': 2,             // http://eslint.org/docs/rules/no-unreachable
    'use-isnan': 2,                  // http://eslint.org/docs/rules/use-isnan
    'block-scoped-var': 2,           // http://eslint.org/docs/rules/block-scoped-var

    /**
     * Best practices
     */
    'consistent-return': 2,          // http://eslint.org/docs/rules/consistent-return
    'curly': [2, 'multi-line' ],      // http://eslint.org/docs/rules/curly
    'default-case': 2,               // http://eslint.org/docs/rules/default-case
    'dot-notation': [2, {            // http://eslint.org/docs/rules/dot-notation
      'allowKeywords': true,
    } ],
    'eqeqeq': 2,                     // http://eslint.org/docs/rules/eqeqeq
    'guard-for-in': 2,               // http://eslint.org/docs/rules/guard-for-in
    'no-caller': 2,                  // http://eslint.org/docs/rules/no-caller
    'no-else-return': 2,             // http://eslint.org/docs/rules/no-else-return
    'no-eq-null': 2,                 // http://eslint.org/docs/rules/no-eq-null
    'no-eval': 2,                    // http://eslint.org/docs/rules/no-eval
    'no-extend-native': 2,           // http://eslint.org/docs/rules/no-extend-native
    'no-extra-bind': 2,              // http://eslint.org/docs/rules/no-extra-bind
    'no-fallthrough': 2,             // http://eslint.org/docs/rules/no-fallthrough
    'no-floating-decimal': 2,        // http://eslint.org/docs/rules/no-floating-decimal
    'no-implied-eval': 2,            // http://eslint.org/docs/rules/no-implied-eval
    'no-lone-blocks': 2,             // http://eslint.org/docs/rules/no-lone-blocks
    'no-loop-func': 2,               // http://eslint.org/docs/rules/no-loop-func
    'no-multi-str': 2,               // http://eslint.org/docs/rules/no-multi-str
    'no-native-reassign': 2,         // http://eslint.org/docs/rules/no-native-reassign
    'no-new': 2,                     // http://eslint.org/docs/rules/no-new
    'no-new-func': 2,                // http://eslint.org/docs/rules/no-new-func
    'no-new-wrappers': 2,            // http://eslint.org/docs/rules/no-new-wrappers
    'no-octal': 2,                   // http://eslint.org/docs/rules/no-octal
    'no-octal-escape': 2,            // http://eslint.org/docs/rules/no-octal-escape
    'no-param-reassign': 2,          // http://eslint.org/docs/rules/no-param-reassign
    'no-proto': 2,                   // http://eslint.org/docs/rules/no-proto
    'no-redeclare': 2,               // http://eslint.org/docs/rules/no-redeclare
    'no-return-assign': 2,           // http://eslint.org/docs/rules/no-return-assign
    'no-script-url': 2,              // http://eslint.org/docs/rules/no-script-url
    'no-self-compare': 2,            // http://eslint.org/docs/rules/no-self-compare
    'no-sequences': 2,               // http://eslint.org/docs/rules/no-sequences
    'no-throw-literal': 2,           // http://eslint.org/docs/rules/no-throw-literal
    'no-with': 2,                    // http://eslint.org/docs/rules/no-with
    'radix': 2,                      // http://eslint.org/docs/rules/radix
    'vars-on-top': 2,                // http://eslint.org/docs/rules/vars-on-top
    'yoda': 2,                       // http://eslint.org/docs/rules/yoda

    /**
     * Style
     */
    'indent': [
      2,
      2, {
        'SwitchCase': 1,
      },
    ],                              // http://eslint.org/docs/rules/indent
    'brace-style': [
      2,
      '1tbs', {
        'allowSingleLine': true,
      },
    ],                               // http://eslint.org/docs/rules/brace-style
    'quotes': [
      2, 'single', 'avoid-escape',    // http://eslint.org/docs/rules/quotes
    ],
    'camelcase': [2, {               // http://eslint.org/docs/rules/camelcase
      'properties': 'never',
    } ],
    'comma-spacing': [2, {           // http://eslint.org/docs/rules/comma-spacing
      'before': false,
      'after': true,
    } ],
    'comma-dangle': ['error', 'always-multiline' ],
    'comma-style': [2, 'last' ],      // http://eslint.org/docs/rules/comma-style
    'eol-last': 2,                   // http://eslint.org/docs/rules/eol-last
    'func-names': ['error', 'never' ], // http://eslint.org/docs/rules/func-names
    'key-spacing': [2, {             // http://eslint.org/docs/rules/key-spacing
      'beforeColon': false,
      'afterColon': true,
    } ],
    'new-cap': [0, {                 // http://eslint.org/docs/rules/new-cap
      'newIsCap': true,
    } ],
    'no-multiple-empty-lines': [2, { // http://eslint.org/docs/rules/no-multiple-empty-lines
      'max': 2,
    } ],
    'no-nested-ternary': 2,          // http://eslint.org/docs/rules/no-nested-ternary
    'no-new-object': 2,              // http://eslint.org/docs/rules/no-new-object
    'no-spaced-func': 2,             // http://eslint.org/docs/rules/no-spaced-func
    'no-trailing-spaces': 2,         // http://eslint.org/docs/rules/no-trailing-spaces
    'no-extra-parens': [2, 'functions' ], // http://eslint.org/docs/rules/no-extra-parens
    'no-underscore-dangle': 0,       // http://eslint.org/docs/rules/no-underscore-dangle
    'one-var': [2, 'never' ],         // http://eslint.org/docs/rules/one-var
    'padded-blocks': [2, 'never' ],   // http://eslint.org/docs/rules/padded-blocks
    'semi': [2, 'always' ],           // http://eslint.org/docs/rules/semi
    'semi-spacing': [2, {            // http://eslint.org/docs/rules/semi-spacing
      'before': false,
      'after': true,
    } ],
    'space-before-blocks': 2,        // http://eslint.org/docs/rules/space-before-blocks
    'space-before-function-paren': ['error', {
      'asyncArrow': 'always',
      'anonymous': 'always',
      'named': 'never',
    } ],
    'space-infix-ops': 2,            // http://eslint.org/docs/rules/space-infix-ops
    'spaced-comment': [2, 'always',  {// http://eslint.org/docs/rules/spaced-comment
      'exceptions': ['-', '+' ],
      'markers': ['=', '!' ],           // space here to support sprockets directives
    } ],
    'max-len': [2, { 'code': 120 } ],
    'import/no-unresolved': 2,
    'import/named': 2,
    'import/default': 2,
    'import/no-duplicates': 2,
    // React
    'jsx-quotes': [2, 'prefer-single' ],
    'react/display-name': 0,
    'react/jsx-boolean-value': 1,
    'react/jsx-closing-bracket-location': 1,
    'react/jsx-first-prop-new-line': [2, 'multiline' ],
    'react/jsx-max-props-per-line': [2, {
      'maximum': 1,
      'when': 'always',
    } ],
    'react/jsx-no-undef': 2,
    'react/jsx-sort-prop-types': 0,
    'react/jsx-sort-props': 0,
    'react/jsx-uses-react': 1,
    'react/jsx-uses-vars': 1,
    'react/jsx-indent': [2, 2 ],
    'react/no-did-mount-set-state': 2,
    'react/no-did-update-set-state': 2,
    'react/no-multi-comp': 2,
    'react/no-unknown-property': 2,
    'react/prop-types': 2,
    'react/react-in-jsx-scope': 2,
    'react/self-closing-comp': ['error', {
      'component': true,
      'html': false,
    } ],
    'react/sort-comp': 2,
    'react/jsx-wrap-multilines': 2,
    'react/jsx-curly-spacing': [2, {
      'when': 'always',
      'children': true,
      'spacing': {
        'objectLiterals': 'never',
      },
    } ],
    'react/jsx-no-bind': [2, {
      'ignoreRefs': false,
      'allowArrowFunctions': true,
      'allowFunctions': false,
      'allowBind': true,
    } ],
  }
};
