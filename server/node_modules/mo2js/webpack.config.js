var
  isProdEnv = ~process.argv.indexOf('--prod'),
  webpack = require('webpack'),
  version = require('./package.json').version,
  config;

config = {
  entry: './src/index',
  output: {
    path: './dist',
    filename: 'mo' + (isProdEnv ? '.min' : '') + '.js',
    library: 'mo',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.BannerPlugin(
      'mo.js v' + version + '\n' +
      'http://mhbseal.com/api/mojs.html\n' +
      '(c) 2014-' + new Date().getFullYear() + ' Mu Haibao'
    )
  ]
};

if (isProdEnv) {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  )
}

module.exports = config;