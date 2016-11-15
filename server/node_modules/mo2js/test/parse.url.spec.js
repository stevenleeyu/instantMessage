/**
 * ParseUrl test
 */
define(['ParseUrl'], function (ParseUrl) {
	"use strict";

  describe('ParseUrl', function () {
    var url = new ParseUrl('http://username:password@www.example.com:80/path/file.name?query=string#anchor');

    it('getAttr', function () {
      expect(url.getAttr('source')).toEqual('http://username:password@www.example.com:80/path/file.name?query=string#anchor');
      expect(url.getAttr('protocol')).toEqual('http');
      expect(url.getAttr('authority')).toEqual('username:password@www.example.com:80');
      expect(url.getAttr('userInfo')).toEqual('username:password');
      expect(url.getAttr('user')).toEqual('username');
      expect(url.getAttr('password')).toEqual('password');
      expect(url.getAttr('host')).toEqual('www.example.com');
      expect(url.getAttr('port')).toEqual('80');
      expect(url.getAttr('relative')).toEqual('/path/file.name?query=string#anchor');
      expect(url.getAttr('path')).toEqual('/path/file.name');
      expect(url.getAttr('directory')).toEqual('/path/');
      expect(url.getAttr('file')).toEqual('file.name');
      expect(url.getAttr('query')).toEqual('query=string');
      expect(url.getAttr('anchor')).toEqual('anchor');
    })

    it('getParam', function () {
      expect(url.getParam()).toEqual({query: 'string'});
      expect(url.getParam('query')).toEqual('string');
    })
  })
});