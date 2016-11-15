var mongoose = require("mongoose");
module.exports = {
    createSession: function(res, username, sessname, nickname){
        F.co(function *() {
            var User = global.dbHelper.getModel('user');
            var Session = global.dbHelper.getModel('session');
            var SessionMember = global.dbHelper.getModel('sessionMember');

            var user = yield User.findOne({username:username});
            if(!user){
                res.json({status:false,msg:'not found user'});
            }

            var session = {
                createrUid: user._id,
                sessName: sessname,
                totalNum: 0,
                type: 1,
            };
            var sess = yield Session.create(session);
            if(!sess){
                res.json({status:false,msg:'create session error'});
            }

            var sessionMember = {
                sessId: sess._id,
                uId: sess.createrUid,
                nickname: nickname,
                readNum: 0,
                lastTime: Date.parse(new Date())
            };
            var sessMem = yield SessionMember.create(sessionMember);
            if (!sessMem) {
                res.json({status: true, msg: 'create session member error'});
            }else{
                res.json({status:true,msg:'createSession success',data:sessMem});
            }

        }, function(err){
            // 统一服务错误处理
            res.status(500);
            res.json({
                status: {
                    code: 2,
                    msg: 'error'
                },
                data: err.stack
            });
        });

    },
    addToSession: function(res, username, sessid, nickname){
        console.log(username, sessid, nickname);
        F.co(function *() {
            var User = global.dbHelper.getModel('user');
            var Session = global.dbHelper.getModel('session');
            var SessionMember = global.dbHelper.getModel('sessionMember');

            var user = yield User.findOne({username:username});
            if(!user){
                res.json({status:false,msg:'not found user'});
            }

            var sess = yield Session.findOne({_id:sessid});
            if(!sess){
                res.json({status:false,msg:'not found session'});
            }

            var sessMem = yield SessionMember.findOne({sessId: sessid, uId: user._id});
            if (sessMem) {
                res.json({status: true, msg: 'user exists'});
                return;
            }

            var sessionMember = {
                sessId: sessid,
                uId: user._id,
                nickname: nickname,
                readNum: 0,
                lastTime: Date.parse(new Date())
            };
            var sessMem = yield SessionMember.create(sessionMember);
            if (sessMem) {
                console.log('addToSession success');
                res.json({status:true,data:sessMem,msg:'addToSession success'});
            }else{
                res.json({status:true,msg:'add session member error',data:sessMem});
            }

        }, function(err){
            // 统一服务错误处理
            res.status(500);
            res.json({
                status: {
                    code: 2,
                    msg: 'error'
                },
                data: err.stack
            });
        });
    },
    kickSession: function(res, username, sessid){
        F.co(function *() {
            var User = global.dbHelper.getModel('user');
            var Session = global.dbHelper.getModel('session');
            var SessionMember = global.dbHelper.getModel('sessionMember');

            var user = yield User.findOne({username:username});
            if(!user){
                res.json({status:false,msg:'not found user'});
            }

            var sess = yield Session.findOne({_id:sessid});
            if(!sess){
                res.json({status:false,msg:'not found session'});
                return;
            }

            var sessionMember = {
                sessId: sess._id,
                uId: user._id
            };
            var result = yield SessionMember.remove(sessionMember);
            if(result.result.n>0){
                deleteSessLog(sessionMember.sessId, sessionMember.uId);
                console.log('kickSession success');
                res.json({status:true,msg:'kickSession success'});
            }else{
                res.json({status:false,msg:'kickSession faild'});
            }

        }, function(err){
            // 统一服务错误处理
            res.status(500);
            res.json({
                status: {
                    code: 2,
                    msg: 'error'
                },
                data: err.stack
            });
        });
    },
    sendMessage: function(res, username, sessid, content){
        F.co(function *() {
            var User = global.dbHelper.getModel('user');
            var Session = global.dbHelper.getModel('session');
            var SessionMember = global.dbHelper.getModel('sessionMember');
            var ChatLog = global.dbHelper.getModel('chatLog');

            var user = yield User.findOne({username:username});
            if(!user){
                res.json({status:false,msg:'not found user'});
            }

            var sess = yield Session.findOne({_id:sessid});
            if(!sess){
                res.json({status:false,msg:'not found session'});
            }

            var sessMem = yield SessionMember.findOne({sessId: sessid, uId: user._id});
            if (!sessMem) {
                res.json({status:false,msg:'you have not privilege'});
            }

            var chatLog = {
                sessId: sessid,
                senderUid: user._id,
                content: content,
                sendTime: Date.parse(new Date())
            };
            var chatlog = yield ChatLog.create(chatLog);

            if(chatlog){
                updateSessNum(chatlog.sessId);
                res.json({status:true,msg:'send success'});
            }else{
                res.json({status:false,msg:'send faild'});
            }
        }, function(err){
            // 统一服务错误处理
            res.status(500);
            res.json({
                status: {
                    code: 2,
                    msg: 'error'
                },
                data: err.stack
            });
        });
    },
    getSessList: function(res,username){
        F.co(function *() {
            var User = global.dbHelper.getModel('user');
            var Session = global.dbHelper.getModel('session');
            var SessionMember = global.dbHelper.getModel('sessionMember');

            var user = yield User.findOne({username:username});
            if(!user){
                res.json({status:false,msg:'not found user'});
            }

            var sessMem = yield SessionMember.find({uId: user._id});
            if(!sessMem){
                res.json({status:false,msg:'not found session'});
            }

            var sessIdList = [];
            var readNumList = {};
            sessMem.forEach(function(row){
                sessIdList.push(row.sessId);
                readNumList[row.sessId] = row.readNum;
            });
            //console.log(sessIdList, readNumList);
            var sess = yield Session.find().where('_id').in(sessIdList).exec();
            if(!sess){
                res.json({status:false,msg:'not found session'});
            }

            var sessList = [];
            var data = {"mine":{"username": user.username,
                "id": user._id,
                "status": "online",
                "sign": "在深邃的编码世界，做一枚轻盈的纸飞机",
                "avatar": global.avatarList.mine}};
            if(sess){
                for(var i = 0; i < sess.length; i++){
                    var tmp = {id:sess[i]._id,groupname:sess[i].sessName,"avatar": global.avatarList.group,totalNum:sess[i].totalNum};
                    tmp.readNum = readNumList[sess[i]._id];
                    tmp.unreadNum = tmp.totalNum - tmp.readNum;
                    sessList.push(tmp);
                }
                data.group = sessList;
            }
            res.json({code:0,data:data,msg:'success'});

        }, function(err){
            // 统一服务错误处理
            res.status(500);
            res.json({
                status: {
                    code: 2,
                    msg: 'error'
                },
                data: err.stack
            });
        });
    },
	getMemberList: function(res,sessId){
        F.co(function *() {
            var User = global.dbHelper.getModel('user');
            var SessionMember = global.dbHelper.getModel('sessionMember');

            var sessMem = yield SessionMember.find({sessId:sessId});
            if(!sessMem){
                res.json({code:0,data:{list:[]},msg:'success'});
            }

            var userIdList = [], userList = {};
            for(var i = 0; i < sessMem.length; i++){
                userIdList.push(sessMem[i].uId);
            }

            var users = yield User.find().where('_id').in(userIdList).select('username').exec();
            if(users){
                for(var i = 0; i < users.length; i++){
                    userList[users[i]._id] = users[i].username;
                }
            }
            var memberList = [];
            for(var i = 0; i < sessMem.length; i++){
                var user = {"username": sessMem[i].nickname,
                    "loginname": userList[sessMem[i].uId],
                    "id": sessMem[i].uId,
                    "sign": sessMem[i].nickname,
                    "avatar": global.avatarList.other
                };
                memberList.push(user);
            }
            res.json({code:0,data:{list:memberList},msg:'success'});

        }, function(err){
            // 统一服务错误处理
            res.status(500);
            res.json({
                status: {
                    code: 2,
                    msg: 'error'
                },
                data: err.stack
            });
        });
	},
    getHistorySessionLog: function(res, sessId, uid){
        F.co(function *() {
            var SessionMember = global.dbHelper.getModel('sessionMember');
            var ChatLog = global.dbHelper.getModel('chatLog');

            var where = {"sessId":sessId};
            var historys = yield ChatLog.find(where).sort({'sendTime':1}).exec();

            if(historys.length>0) {
                var historyList = [];
                var userIdList = [];
                historys.forEach(function (row) {
                    var history = {
                        id: row._id,
                        senderUid: row.senderUid,
                        mine: row.senderUid == uid,
                        content: row.content,
                        sendTime: row.sendTime
                    };
                    historyList.push(history);
                    userIdList.push(row.senderUid);
                });

                var userList = yield SessionMember.find(where).exec();

                var userInfoList = [];
                if (userList) {
                    for (var i = 0; i < userList.length; i++) {
                        userInfoList[userList[i].uId] = {
                            'username': userList[i].nickname,
                            'avatar': userList[i].uId == uid ? global.avatarList.mine : global.avatarList.other
                        };
                    }
                    for (var i = 0; i < historyList.length; i++) {
                        if (historyList[i].senderUid in userInfoList) {
                            historyList[i].userInfo = userInfoList[historyList[i].senderUid];
                        } else {
                            historyList[i].userInfo = {'username': 'somebody', 'avatar': global.avatarList.other};
                        }
                    }
                }
                //console.log(historys);
                //res.render('history',{historys:historyList});
                res.json({status: true, data: historyList, msg: 'success'});
            }else{
                res.json({status:true,data:[],msg:'not have history'});
            }

        }, function(err){
            // 统一服务错误处理
            res.status(500);
            res.json({
                status: {
                    code: 2,
                    msg: 'error'
                },
                data: err.stack
            });
        });
    }
};

function updateSessNum(sessId){
    var Session = global.dbHelper.getModel('session');
    var ChatLog = global.dbHelper.getModel('chatLog');
    //console.log(sessId);
    ChatLog.where('sessId', sessId).count(function (err, count) {
        if (err) return handleError(err);
        Session.update({"_id": sessId}, {$set: {totalNum: count}}, function (error, doc) {
            console.log('updateSessNum success');
        });
    })
}

function deleteSessLog(sessId,uid){
    var ChatLog = global.dbHelper.getModel('chatLog');
    ChatLog.remove({'sessId':sessId,'senderUid':uid},function(error,doc){
        //成功返回1  失败返回0
        if(doc > 0){
            updateSessNum(sessId)
        }
    });
}
