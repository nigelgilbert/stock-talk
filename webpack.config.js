var webpack = require('webpack');
var path = require('path');

module.exports = {

  entry: {
      index: "./scripts/index.js"
  },

  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
      },
      {
        test: /\.(png|jpg)$/,
        loader: "file?name=[name].[ext]",
      },
      {
        test: /\.css$/,
        loader: "file?name=[name].[ext]",
      }
    ],
  },

  node: {
    fs: "empty"
  },

}