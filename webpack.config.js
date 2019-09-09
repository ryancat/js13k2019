const path = require('path')
const webpack = require('webpack')

// Plugins
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ZipPlugin = require('zip-webpack-plugin')

module.exports = function(env, argv) {
  const mode = argv.mode || 'development'
  console.info('running webpack with mode:', mode)

  // Plugins
  const plugins = [
    new webpack.DefinePlugin({
      IS_DEV_MODE: mode === 'development',
    }),
    // Remove unnecessary module getter calls in webpack
    // new webpack.optimize.ModuleConcatenationPlugin(),
    // Analyze the bundle
    new BundleAnalyzerPlugin({
      // Generate static report file
      analyzerMode: 'static',
      // Do not open analyzer result in browser
      openAnalyzer: false,
      // Show gzip size by default. Close to user experience
      defaultSizes: 'gzip',
      // HTML report location
      reportFilename: './reports/bundleAnalyzer/bundleStats.html',
      // Generate stats json file
      generateStatsFile: true,
      // JSON stats location
      statsFilename: './reports/bundleAnalyzer/bundleStats.json',
    }),
    // Copy the index.html to the public folder
    new CopyWebpackPlugin([
      {
        from: './src/index.html',
        to: './index.html',
      },
    ]),
  ]

  if (mode === 'production') {
    plugins.push(
      new ZipPlugin({
        // path: '',
        filename: 'main.zip',
      })
    )
  }

  return {
    mode: mode,

    entry: {
      main: './src/main.js',
    },

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'public'),
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },

    // Use eval-source-map to get faster rebuild sourcemap
    // devtool: mode === 'production' ? undefined : 'inline-source-map',
    devtool: mode === 'production' ? undefined : 'inline-source-map',

    devServer: {
      contentBase: './public',
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { modules: false }]],
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: {
            loader: 'file-loader',
          },
          exclude: /node_modules/,
        },
      ],
    },

    plugins: plugins,
  }
}
