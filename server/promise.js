var mongoose = require("mongoose");
global.dbHelper = require('./common/dbHelper');
global.db = mongoose.connect("mongodb://127.0.0.1:27017/notify");
var User = global.dbHelper.getModel('user');
var Session = global.dbHelper.getModel('session');
var SessionMember = global.dbHelper.getModel('sessionMember');


(function(){
    var promise = new mongoose.Promise();
    User.findOne({username:'lee'},function(err,user){
        promise.resolve(err, user);
    });
    return promise;
})().then(function(user){
    var promise = new mongoose.Promise();
    var session = {
        createrUid: user._id,
        sessName: 'test session 123',
        totalNum: 0,
        type: 1,
    };
    Session.create(session,function(err,sess) {
        promise.resolve(err, sess);
    });
    return promise;
},function(){
    res.json({status:false,msg:'not found user'});
}).then(function(sess){
    var promise = new mongoose.Promise();
    var sessionMember = {
        sessId: sess._id,
        uId: sess.createrUid,
        readNum: 0,
        lastTime: Date.parse(new Date())
    };
    SessionMember.create(sessionMember,function(err,sessMem) {
        promise.resolve(err, sessMem);
    });
    return promise;
},function(err){
    console.log(err);
    res.json({status:false,msg:'create session error'});
    return;
}).then(function(){
    res.json({status:true,msg:'success'});
},function(err){
    console.log(err);
    res.json({status:false,msg:'create session member error'});
    return;
});