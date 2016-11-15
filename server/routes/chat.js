var	chatModel = require('../model/chatModel');

module.exports = function ( app ) {
    //创建会话
    app.post("/chat/create",function(req,res){
        //console.log(req.body);
        var nickname = typeof req.body.nickname!='undefined' && req.body.nickname!=''?req.body.nickname:req.body.username;
        chatModel.createSession(res, req.body.username, req.body.sessname, nickname);
    });

    //加入会话
    app.post("/chat/addSession",function(req,res){
        var nickname = typeof req.body.nickname!='undefined' && req.body.nickname!=''?req.body.nickname:req.body.username;
        chatModel.addToSession(res, req.body.username, req.body.sessid, nickname);
    });

    //踢出会话
    app.post("/chat/kickSession",function(req,res){
        chatModel.kickSession(res, req.body.username, req.body.sessid);
    });

    //发消息
    app.post("/chat/send",function(req,res){
        chatModel.sendMessage(res, req.body.username, req.body.sessid, req.body.content);
    });

    //获取用户会话列表
    app.get("/chat/sessList/:username",function(req,res){
        chatModel.getSessList(res, req.params.username);
    });
	
	//获取用户会话列表
    app.get("/chat/memberList",function(req,res){
        chatModel.getMemberList(res, req.query.id);
    });

    //获取历史消息
    app.get("/chat/history",function(req,res){
        chatModel.getHistorySessionLog(res, req.query.id, req.query.uid);
    });


}
