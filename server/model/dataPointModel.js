/**
 * Created by Transn on 2016-10-25.
 */
var	mqService = require('../service/mqService');

module.exports = {
    //发送消息的数据埋点
    sendMsgPoint: function(data){
        var Session = global.dbHelper.getModel('session');
        var ChatLog = global.dbHelper.getModel('chatLog');

        //console.log("sendMsgPoint");
        ChatLog.find({'sessId':data.sessId}).sort({'sendTime':-1}).limit(2).exec(function(err,chatlogs){
            if(!err){
                Session.findOne({'_id':data.sessId}).exec(function(err,sess){
                    if(!err && sess){
                        var logsLen = chatlogs.length;
                        if(logsLen == 0){
                            var firstMessage = {
                                "from": data.senderUsername,
                                "orderid": sess.sessName,
                                "qunid": data.sessId,
                                "sendTime": data.sendTime,
                                "text": data.content,
                                "chatCount": 1
                            };
                            mqService.publishMQ(firstMessage);
                        }
                        if(logsLen == 1){
                            var lastLog = chatlogs.shift();
                            if(lastLog.senderUid == data.senderUid && lastLog.sendTime == data.sendTime && lastLog.content == data.content){
                                var firstMessage = {
                                    "from": data.senderUsername,
                                    "orderid": sess.sessName,
                                    "qunid": data.sessId,
                                    "sendTime": data.sendTime,
                                    "text": data.content,
                                    "chatCount": 1
                                };
                                mqService.publishMQ(firstMessage);
                            }
                        }

                        if(logsLen >= 1){
                            var lastLog = chatlogs.shift();
                            if(lastLog.senderUid == sess.createrUid && data.senderUid != sess.createrUid){
                                var replyMessage = {
                                    "from": data.senderUsername,
                                    "orderid": sess.sessName,
                                    "qunid": data.sessId,
                                    "sendTime": data.sendTime,
                                    "text": data.content,
                                    "timeType": "TR-CU",
                                    "difTime": parseInt((data.sendTime - lastLog.sendTime)/1000)
                                };
                                mqService.publishMQ(replyMessage);
                            }
                        }
                    }
                });
            }
        });
    }
};