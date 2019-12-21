const path = require('path');
const hwp = require('html-webpack-plugin');

module.exports = {
  entry: './App.js',
  output: {
    path: path.resolve(__dirname),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        loader: 'style-loader!css-loader?modules'
      }
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/pages": path.resolve(__dirname, "src/pages"),
      "@/components": path.resolve(__dirname, "src/components")
    }
  },
  plugins: [
    new hwp({
      template: './index.html'
    })
  ]
}