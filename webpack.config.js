var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry:  {
    index: "./client/bootstrap.js"
  },
  output: {
    path: path.join(__dirname, "public"),
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      { test: /\.css$/,
        loader: 'css'
      },
    ],
  },
  node: {
    fs: "empty"
  },
};