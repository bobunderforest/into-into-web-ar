const path = require('path')
require('dotenv').config()
const webpack = require('webpack')
const PugPlugin = require('pug-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const BASE_URL = String(process.env.BASE_URL)

module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js'],
  },

  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: BASE_URL,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.BASE_URL': JSON.stringify(BASE_URL),
    }),
    new PugPlugin({
      hotUpdate: true,
      entry: 'src/views/',
      pretty: true,
      js: {
        filename: 'js/[name].[contenthash:8].js',
      },
      css: {
        filename: 'css/[name].[contenthash:8].css',
      },
    }),
    new CopyPlugin({
      patterns: [{ from: 'static', to: './' }],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(s?css|sass)$/,
        use: ['css-loader', 'sass-loader'],
      },
      {
        test: /\.(ico|png|jpe?g|webp|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[hash:8][ext][query]',
        },
      },
      {
        test: /\.([cm]?ts|tsx)$/,
        loader: 'ts-loader',
      },
    ],
  },

  devServer: {
    static: [path.join(__dirname, 'static')],
    watchFiles: path.join(__dirname, 'src'),
    port: 3000,
    hot: true,
    server: 'https',
    // liveReload: true,
  },
}
