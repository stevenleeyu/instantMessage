var	notifyService = require('./notifyService');
var	dataPointModel = require('../model/dataPointModel');

module.exports = {
	setCurrSession: function(socket, sessId){
		var SessionMember = global.dbHelper.getModel('sessionMember');
		SessionMember.find({'sessId':sessId}).select('uId').exec(function(err,uIdList){
			var sessMembers = [],currSession = {};
			for(var i in uIdList){
				sessMembers.push(uIdList[i].uId);
			}
			currSession = {sessId:sessId,sessMembers:sessMembers};
			var user = {_id:socket.user._id,username:socket.user.username,nickname:socket.user.nickname,currSession:currSession};
			delete socket.user;
			socket.user = user;
			instantMessage.listen(socket, sessId);
		});
	},
	emptyCurrSession: function(socket){
		var user = {_id:socket.user._id,username:socket.user.username,nickname:socket.user.nickname};
		delete socket.user;
		socket.user = user;
	},
	sendMessage: function(socket, message){
		var thisService = this;
		var ChatLog = global.dbHelper.getModel('chatLog');
		var chatLog = {
			sessId: message.sessId,
			senderUid: socket.user._id,
			content: message.content,
			sendTime: Date.parse(new Date())
		};
		//2016-10-25 添加发送消息的数据埋点
		var dataPoint = {
			sessId: message.sessId,
			senderUid: socket.user._id,
			senderUsername: socket.user.username,
			content: message.content,
			sendTime: Date.parse(new Date())
		};
		dataPointModel.sendMsgPoint(dataPoint);

		ChatLog.create(chatLog,function(err, chatlog){
			if(!err && chatlog){
				updateSessNum(chatlog.sessId,function(){
					if(typeof socket.user.currSession != 'undefined' && message.sessId == socket.user.currSession.sessId){
						global.connectionsArray.forEach(function(sc){
							var memberIndex = socket.user.currSession.sessMembers.indexOf(String(sc.user._id));
							if(memberIndex>-1){
								if(typeof sc.user.currSession != 'undefined' && sc.user.currSession.sessId == socket.user.currSession.sessId){
									instantMessage.listen(sc, chatlog.sessId);
								}else{
									notifyService.unreadMessage(sc);
								}
							}
						});
					}else{
						thisService.setCurrSession(socket, message.sessId);
					}
				})
			}
		});
	}
};

function updateSessNum(sessId,callback){
	var Session = global.dbHelper.getModel('session');
	var ChatLog = global.dbHelper.getModel('chatLog');
	//console.log(sessId);
	ChatLog.where('sessId', sessId).count(function (err, count) {
		if (err) return handleError(err);
		Session.update({"_id": sessId}, {$set: {totalNum: count}}, function (error, doc) {
			console.log('updateSessNum success');
			callback();
		});
	})
}

var instantMessage = {
	listen: function(socket, sessId){
		var ChatLog = global.dbHelper.getModel('chatLog');
		var Session = global.dbHelper.getModel('session');
		var SessionMember = global.dbHelper.getModel('sessionMember');

		Session.findOne({'_id':sessId}).select('totalNum').exec(function(err,total){
			SessionMember.findOne({'sessId':sessId,'uId':socket.user._id}).select('readNum').exec(function(err,read){
				var unreadNum = total.totalNum - read.readNum;
				//console.log(total, read, unreadNum);
				if(unreadNum>0){
					ChatLog.find({'sessId':sessId}).sort({'sendTime':-1}).limit(unreadNum).exec(function(err,chatlogs){
						var chatlogList = [];
						var userIdList = [];
						chatlogs.forEach(function(row){
							var chatlog =
							{
								id:row._id,
								sessId:row.sessId,
								senderUid:row.senderUid,
								mine:socket.user._id == row.senderUid,
								content:row.content,
								sendTime:row.sendTime
							};
							chatlogList.unshift(chatlog);
							userIdList.push(row.senderUid);
						});
						SessionMember.find({'sessId':sessId}).exec(function(err,userList) {
							var userInfoList = [];
							if(userList){
								for(var i = 0; i < userList.length; i++){
									userInfoList[userList[i].uId] = {'username':userList[i].nickname,'avatar':userList[i].uId==socket.user._id?global.avatarList.mine:global.avatarList.other};
								}
								for(var i = 0; i < chatlogList.length; i++){
									if(chatlogList[i].senderUid in userInfoList){
										chatlogList[i].userInfo = userInfoList[chatlogList[i].senderUid];
									}else{
										chatlogList[i].userInfo = {'username':'somebody','avatar':global.avatarList.other};
									}
								}
							}
							//console.log(chatlogList);
							SessionMember.update({'sessId':sessId,'uId':socket.user._id},{$set : { readNum : total.totalNum }},function(){
								socket.volatile.emit('instantMessage', chatlogList);
								global.connectionsArray.forEach(function(sc){
									if(String(sc.user._id) == String(socket.user._id)){
										notifyService.unreadMessage(sc);
									}
								});
							});
						});
					});
				}
			});
		});
	}
};