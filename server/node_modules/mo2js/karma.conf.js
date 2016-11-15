var
  webpackConfig = require('./webpack.config');

module.exports = function(config) {
  config.set({
    basePath: './test',
    frameworks: ['jasmine'],
    files: [
      '**/*.spec.js'
    ],
    preprocessors: {
      '**/*.spec.js': ['webpack', 'coverage']
    },
    webpack: {
      resolve: {
        root: './src',
        alias: {
          AbstractStorage: 'store/AbstractStorage',
          AbstractStore: 'store/AbstractStore',
          LocalStore: 'store/LocalStore',
          SessionStore: 'store/SessionStore',
          common: 'common',
          Cookie: 'Cookie',
          date: 'date',
          es5: 'es5.super',
          IdCard: 'IdCard',
          objectPath: 'object.path',
          ParseUrl: 'parse.url',
          pubSub: 'pubSub',
          rules: 'rules',
          util: 'util'
        }
      }
    },
    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: '../testCoverageReporter'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'/*, 'Firefox', 'Safari', 'IE'*/],
    singleRun: false, // 启动浏览器运行完测试后是否自动退出
    plugins: [
      'karma-webpack',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-safari-launcher',
      'karma-ie-launcher',
      'karma-coverage'
    ]
  })
}
