var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'aq-miniapp-core-0.0.14.min.js',
    library: 'AQCore',
    libraryTarget: 'window'
  },
  // externals: [
  //   'base64-js',
  //   'hawk',
  //   'text-encoding-utf-8',
  //   'uuid',
  //   'whatwg-fetch'
  // ],
  module: {
    rules: [
      { test: /\.js$/, loader: "babel-loader" }
    ]
  },
  mode: 'production'
}