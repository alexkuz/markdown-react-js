var webpack = require('webpack');
var chalk = require('chalk');

var start = new Date().getTime();

function getTime() {
  var time = new Date().getTime();
  var date = new Date(time - start);
  var minutes = date.getUTCMinutes().toString();
  var seconds = date.getUTCSeconds().toString();
  var ms = date.getUTCMilliseconds().toString();
  return (
    '00'.substring(0, 2 - minutes.length) + minutes + ':' +
    '00'.substring(0, 2 - seconds.length) + seconds + '.' +
    ms.substring(0, 2)
  );
}

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
  externals: {
    'babel-core/browser': 'babel',
    'react': 'React',
    'react/addons': 'React'
  },
  plugins: [
    new webpack.ProgressPlugin(function (progress, message) {
      console.log(chalk.cyan('[' + getTime() + ']'), message);
    }),
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