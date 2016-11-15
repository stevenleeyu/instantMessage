var pkg = require('./package.json');

module.exports = {
  name: 'mojs',
  version: pkg.version,
  repositoryUrl: pkg.homepage,
  introduction: 'mojs，一个javascript常用方法库，包含了浏览器中对storage、cookie的操作封装，e5 super，date日期处理，身份证、url中元素校验解析，及一些其他常用的方法集合（正则、extend、继承、类等...）。<br /><br />源码采用AMD书写，以webpack打包，karma+jasmine单元测试，UMD格式输出。',
  paths: {
    input: "./src",
    output: "./doc"
  },
  source: './dist/mo.min.js',
  skip: ["store/AbstractStorage.js"]
}