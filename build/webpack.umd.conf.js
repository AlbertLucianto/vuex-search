const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: {
    'vuex-search': ['babel-polyfill', './src/index.js']
  },
  output: {
    path: path.resolve(__dirname, '../dist/umd'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'VuexSearch'
  },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        },
        output: {
          comments: true,
          beautify: true
        },
        mangle: false
      },
      parallel: true,
      sourceMap: true
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      }
    ]
  }
}