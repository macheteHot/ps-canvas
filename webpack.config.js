const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  entry   : './src/main.ts',
  devtool : 'inline-source-map',
  output  : {
    path     : resolve('dist'),
    filename : 'bundle.js',
  },
  devServer: {
    stats : 'errors-only',
    hot   : true,
    port  : 8080, // 端口号
  },
  module: {
    rules: [
      {
        test    : /\.ts$/,
        use     : 'ts-loader',
        exclude : /node_modules/,
      },
      {
        test : /\.css$/,
        use  : [
          'style-loader',
          {
            loader  : 'css-loader',
            options : {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename : 'index.html',
      template : 'public/index.html',
    }),
    new ProgressBarPlugin(),
    new CleanTerminalPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
}
