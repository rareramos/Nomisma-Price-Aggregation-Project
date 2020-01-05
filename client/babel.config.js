module.exports = {
  env: {
    test: {
      presets: [
        '@babel/typescript',
      ],
    },
  },
  presets: [
    '@babel/env',
    '@babel/react',
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-runtime',
  ],
};
