/**
 * IdCard test
 */
define(['IdCard'], function (IdCard) {
	"use strict";

  describe('IdCard', function () {
    var
      idCard = new IdCard('610125198711037137'),
      idCard2 = new IdCard('610125198711337138');

    it('checkCode', function () {
      expect(idCard.checkCode()).toBeTruthy();
      expect(idCard2.checkCode()).not.toBeTruthy();
    })
    it('checkBirth', function () {
      expect(idCard.checkBirth()).toBeTruthy();
      expect(idCard2.checkBirth()).not.toBeTruthy();
    })
    it('getBirth', function () {
      expect(idCard.getBirth()).toEqual({year: '1987', month: '11', day: '03'});
    })
    it('getSex', function () {
      expect(idCard.getSex()).toEqual('男');
    })
  })
});