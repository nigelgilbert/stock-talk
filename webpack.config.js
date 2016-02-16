var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry:  {
    index: "./client/index.js"
  },
  output: {
    path: path.join(__dirname, "public"),
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ],
  },
  node: {
    fs: "empty"
  },
};