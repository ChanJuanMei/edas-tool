const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// const prodMode = process.env.NODE_ENV === 'production';

const srcResolve = function (file) {
  return path.join(__dirname, '..', 'assets', file);
};

const distResolve = function (file) {
  return path.join(__dirname, '..', '.tmp', file);
};

module.exports = {
  entry: {
    'entry': srcResolve('index.js')
  },
  output: {
    path: distResolve(''),
    filename: 'js/[name].js'
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
           options: {
              babelrc: false,
              presets: [
                  ['@babel/preset-env', {
                      targets: {
                          browsers: ['last 3 versions', 'Safari >= 10', 'iOS >= 10','ie >= 10']
                      },
                      useBuiltIns: 'entry'
                  }],
                  '@babel/preset-react'
              ],
              "plugins": [
                  ["import", {
                      "libraryName": "antd",
                      "style": "css"
                  }],
                  "@babel/plugin-proposal-class-properties",
              ]
          },
        }
      },
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'views', 'index.ejs'),
      title: 'HTML Webpack Plugin',
  })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
};