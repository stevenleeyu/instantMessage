/**
 * webpack打包目前不能暴漏多个模块，并且他的requrie解析是静态的，所以这里暂时把全部模块挂在mo下，然后输出mo
 */
define(function() {
	"use strict";
  return {
    AbstractStorage: require('./store/AbstractStorage'),
    AbstractStore: require('./store/AbstractStore'),
    LocalStore: require('./store/LocalStore'),
    SessionStore: require('./store/SessionStore'),
    common: require('./common'),
    Cookie: require('./Cookie'),
    date: require('./date'),
    es5: require('./es5.super'),
    IdCard: require('./IdCard'),
    objectPath: require('./object.path'),
    ParseUrl: require('./parse.url'),
    pubSub: require('./pubSub'),
    rules: require('./rules'),
    util: require('./util')
  };
});