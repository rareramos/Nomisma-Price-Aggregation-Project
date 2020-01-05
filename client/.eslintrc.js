module.exports = {
  "extends": "@nomisma/eslint-config-shared/ts-react/.eslintrc.json",
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  rules: {
    "import/prefer-default-export": [0],
    "import/no-cycle": [0],
    "no-param-reassign": ["error", { "props": false }],
    "react/jsx-filename-extension": [2, { "extensions": [".js", ".jsx", ".tsx"] }], // should be remove after fix in ts-react config
    "react/forbid-prop-types": [0]
  },
  overrides: [{
    files: ["webpack.*.js", "environment.js"],
    rules: {
      "global-require": [0],
      "@typescript-eslint/no-var-requires": [0],
    },
  }, {
    files: [
      "*.test.{js,ts,tsx,js}",
      "webpack.*.js",
      "test/setupTestFramework.js",
    ],
    rules: {
      "import/no-extraneous-dependencies": [0],
      "no-underscore-dangle": [0],
      "@typescript-eslint/camelcase": [0]
    },
  }, {
    files: ["src/**/*.test.ts", "src/store/__mocks__/index.js"],
    env: {
      jest: true,
    }
  }],
  "globals": {
    "LOANS_API_ENDPOINT": true,
    "API_URI": true,
    "USE_OWN_API": true,
    "CFD_API_URL": true,
  },
};
