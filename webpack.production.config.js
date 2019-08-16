const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
var ZipPlugin = require('zip-webpack-plugin');

module.exports = {
  entry: {
    'main': './src/main.js'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public'),
    libraryTarget: 'umd'
  },

  module: {
    rules: [{
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: /node_modules/
    }, {
      test: /\.(png|svg|jpg|gif)$/,
      use: ['file-loader'],
      exclude: /node_modules/
    }]
  },

  plugins: [
    new CopyWebpackPlugin([{
      from: './src/index.html',
      to: './index.html'
    }]),

    new webpack.optimize.UglifyJsPlugin({
      parallel: {
        cache: true,
        workers: 2
      }
    }),

    new ZipPlugin({
      path: '../zip',
      filename: 'main.zip'
    })
  ]
}