var webpack = require('webpack');

module.exports = {
  entry: './src/index',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel?stage=0', exclude: /node_modules/ }
    ]
  },
  output: {
    path: 'js',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
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
  resolve: {
    root: [__dirname],
    modulesDirectories: ['node_modules', 'src'],
    extensions: ['','.js','.jsx']
  }
};