const path = require('path');
const merge = require('webpack-merge');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'source-map-eval',
  devServer: {
    contentBase: path.join(__dirname, './src'),
    compress: true,
    port: 3000,
  },
});
