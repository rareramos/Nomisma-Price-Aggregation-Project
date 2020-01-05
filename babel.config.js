module.exports = function (api) {
  api.cache(true);
  return {
    babelrcRoots: [
      '.',
      './common/*',
      './fetcher/*',
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          'targets': {
            'node': 10,
          },
        },
      ],
    ],
    env: {
      test: {
        'presets': ['@babel/preset-env'],
      },
    },
  };
};
