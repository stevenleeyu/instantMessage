/**
 * pub/sub test
 */
define(['pubSub'], function (pubSub) {
	"use strict";

  describe('pubSub', function () {
    var
      data = [{
        name: '熊大',
        job: '阻止光头强砍树'
      }, {
        name: '熊二',
        job: '调戏光头强'
      }, {
        name: '光头强',
        job: '伐木'
      }],
      dataRet = [
        '熊大应该阻止光头强砍树',
        '熊大喜欢阻止光头强砍树',
        '熊二应该调戏光头强',
        '熊二喜欢调戏光头强',
        '光头强应该伐木'
      ],
      handler = function(data) {
        ret.push(data.name + '应该' + data.job);
      },
      handler2 = function(data) {
        ret.push(data.name + '喜欢' + data.job);
      },
      ret = [];

    it('subscribe and publish', function () {
      pubSub.subscribe('a', handler);
      pubSub.subscribe('a', handler2);
      pubSub.publish('a', data[0]);
      expect(ret[0]).toEqual(dataRet[0]);
      expect(ret[1]).toEqual(dataRet[1]);

      pubSub.subscribe('b', handler);
      pubSub.subscribe('b.b', handler2);
      pubSub.publish('b', data[1]);
      expect(ret[2]).toEqual(dataRet[2]);
      expect(ret[3]).toEqual(dataRet[3]);

      pubSub.subscribe('c', handler);
      pubSub.publish('c', data[2]);
      expect(ret[4]).toEqual(dataRet[4]);
      ret = [];
    })
    it('unsubscribe and publish', function () {
      pubSub.unsubscribe('a', handler2);
      pubSub.publish('a', data[0]);
      expect(ret[0]).toEqual(dataRet[0]);
      expect(ret[1]).not.toBeDefined();

      pubSub.unsubscribe('b');
      pubSub.publish('b', data[1]);
      expect(ret[1]).toEqual(dataRet[3]);
      expect(ret[2]).not.toBeDefined();
      ret = [];
    })
    it('clear and publish', function () {
      pubSub.clear('b');
      pubSub.publish('b', data[1]);
      expect(ret[0]).not.toBeDefined();

      pubSub.clear();
      pubSub.publish('c', data[2]);
      expect(ret[0]).not.toBeDefined();
      ret = [];
    })
  })
});