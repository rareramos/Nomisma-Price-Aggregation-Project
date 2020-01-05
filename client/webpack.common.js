const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const environment = require('./environment');
const parseVars = require('./environment-parse');

module.exports = {
  entry: {
    app: './src/index.tsx',
    vender: [
      'react', 'react-dom', 'redux',
      'react-redux', 'react-router-dom',
      'prop-types'],
  },
  output: {
    path: path.resolve(__dirname, '../docs/'),
    filename: 'js/[name].[chunkhash].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: ['node_modules', 'src'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          'babel-loader',
          'eslint-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'ts-loader',
        ],
      },
      {
        test: /\.s?css$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          }, 'sass-loader'],
        }),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(
      parseVars(
        environment,
      ),
    ),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      favicon: 'src/favicon.png',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      filename: 'manifest.js',
      chunks: ['vender'],
    }),
    new ExtractTextPlugin({
      filename: 'styles/style.css',
    }),
  ],
};
