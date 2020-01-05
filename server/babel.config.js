module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: 'cjs',
        targets: {
          node: 10,
        },
      },
    ],
    [
      '@babel/preset-react',
      {
        development: true, // process.env.BABEL_ENV === 'development'
      },
    ],
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 10,
            },
          },
        ],
      ],
    },
  },
};
