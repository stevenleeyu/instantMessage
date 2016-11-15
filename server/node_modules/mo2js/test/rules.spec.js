/**
 * rules test
 */
define(['rules'], function (rules) {
	"use strict";

  describe('rules', function () {
    it('isRequired', function () {
      expect(rules.isRequired('非空，即为必需')).toBeTruthy();
      expect(rules.isRequired('')).toBeFalsy();
    })
    it('isChinese', function () {
      expect(rules.isChinese('中文')).toBeTruthy();
      expect(rules.isChinese('english')).toBeFalsy();
    })
    it('isDoubleByte', function () {
      expect(rules.isDoubleByte('我是中国人，对没错')).toBeTruthy();
      expect(rules.isDoubleByte('I am American')).toBeFalsy();
    })
    it('isZipcode', function () {
      expect(rules.isZipcode('710302')).toBeTruthy();
      expect(rules.isZipcode('7103022')).toBeFalsy();
    })
    it('isQq', function () {
      expect(rules.isQq(369441319)).toBeTruthy();
      expect(rules.isQq(369)).toBeFalsy();
    })
    it('isPicture', function () {
      expect(rules.isPicture('piicture.jpg')).toBeTruthy();
      expect(rules.isPicture('piicture.xxx')).toBeFalsy();
    })
    it('isRar', function () {
      expect(rules.isRar('abc.rar')).toBeTruthy();
      expect(rules.isRar('abc.abc')).toBeFalsy();
    })
    it('isMobile', function () {
      expect(rules.isMobile(15618526020)).toBeTruthy();
      expect(rules.isMobile(11018526020)).toBeFalsy();
    })
    it('isMoney', function () {
      expect(rules.isMoney(1000.00)).toBeTruthy();
      expect(rules.isMoney('钱')).toBeFalsy();
    })
    it('isEnglish', function () {
      expect(rules.isEnglish('english')).toBeTruthy();
      expect(rules.isEnglish('中文')).toBeFalsy();
    })
    it('isLowerCase', function () {
      expect(rules.isLowerCase('abc')).toBeTruthy();
      expect(rules.isLowerCase('ABC')).toBeFalsy();
    })
    it('isUpperCase', function () {
      expect(rules.isUpperCase('ABC')).toBeTruthy();
      expect(rules.isUpperCase('abc')).toBeFalsy();
    })
    it('isNumber', function () {
      expect(rules.isNumber(1000.000)).toBeTruthy();
      expect(rules.isNumber('abc')).toBeFalsy();
    })
    it('isInteger', function () {
      expect(rules.isInteger(1000)).toBeTruthy();
      expect(rules.isInteger(1000.01)).toBeFalsy();
    })
    it('isFloat', function () {
      expect(rules.isFloat(1000.01)).toBeTruthy();
      expect(rules.isFloat(1000)).toBeFalsy();
    })
    it('isRealName', function () {
      expect(rules.isRealName('陌先生')).toBeTruthy();
      expect(rules.isRealName(119)).toBeFalsy();
    })
    it('isEmail', function () {
      expect(rules.isEmail('mhbseal@163.com')).toBeTruthy();
      expect(rules.isEmail('m163.com')).toBeFalsy();
    })
    it('isUrl', function () {
      expect(rules.isUrl('http://mhbseal.com')).toBeTruthy();
      expect(rules.isUrl('/Users/hbmu/workspace')).toBeFalsy();
    })
    it('isIdCard', function () {
      expect(rules.isIdCard('610125198711037137')).toBeTruthy();
      expect(rules.isIdCard('61012519871103713')).toBeFalsy();
    })
    it('isPhone', function () {
      expect(rules.isPhone('029-8784326-11316')).toBeTruthy();
      expect(rules.isPhone('abc-abcedfg-abcedf')).toBeFalsy();
    })
    it('isAreaNum', function () {
      expect(rules.isAreaNum('029')).toBeTruthy();
      expect(rules.isAreaNum('abc')).toBeFalsy();
    })
    it('isHostNum', function () {
      expect(rules.isHostNum('8784326')).toBeTruthy();
      expect(rules.isHostNum('abcedfg')).toBeFalsy();
    })
    it('isExtensionNum', function () {
      expect(rules.isExtensionNum('11316')).toBeTruthy();
      expect(rules.isExtensionNum('abcedf')).toBeFalsy();
    })
    it('isIp', function () {
      expect(rules.isIp('192.168.0.1')).toBeTruthy();
      expect(rules.isIp('192.168.0.1111')).toBeFalsy();
    })
  })
});