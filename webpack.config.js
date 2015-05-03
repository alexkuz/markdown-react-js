var webpack = require('webpack');

module.exports = {
  entry: './index',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel?stage=0', exclude: /node_modules/ }
    ]
  },
  output: {
    filename: 'dist/markdown-react.min.js',
    libraryTarget: 'umd',
    library: 'MarkdownReact'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  externals: {
    react: 'React'
  }
};