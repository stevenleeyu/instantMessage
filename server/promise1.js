var mongoose = require("mongoose");
global.dbHelper = require('./common/dbHelper');
global.db = mongoose.connect("mongodb://192.168.1.103:27017/notify");
var User = global.dbHelper.getModel('user');
var Session = global.dbHelper.getModel('session');
var SessionMember = global.dbHelper.getModel('sessionMember');

var user = yield User.findById("57c181a1c4e370bc869e1a0b").exec();


console.log(user);
/*
User.findOne({username:'lee'}).exec().then(function(err, userInfo){
	console.log(userInfo);
});

(function(){
	var promise = new mongoose.Promise();
	User.findOne({username:username},function(err,user){
		promise.resolve(err, user);
	});
	return promise;
})().then(function(user){
	var promise = new mongoose.Promise();
	SessionMember.find({uId: user._id},function(err,sessMem) {
		promise.resolve(err, sessMem);
	});
	return promise;
},function(err){
	console.log(err);
	return {status:false,msg:'not found user'};
}).then(function(sessMem){
	var sessIdList = [];
	var readNumList = {};
	sessMem.forEach(function(row){
		sessIdList.push(row.sessId);
		readNumList[row.sessId] = row.readNum;
	});
	//console.log(sessIdList, readNumList);
	var promise = new mongoose.Promise();
	Session.find().where('_id').in(sessIdList).exec(function(err,sess) {
		var result = [];
		if(sess){
			for(var i = 0; i < sess.length; i++){
				var tmp = sess[i];
				tmp.unreadNum = sess[i].totalNum - readNumList[sess[i]._id];
				result.push(tmp);
			}
		}
		promise.resolve(err, result);
	});
	return promise;
},function(err){
	console.log(err);
	res.json({status:false,msg:'not found session'});
}).then(function(sess){
	res.json({status:true,data:sess,msg:'success'});
},function(err){
	console.log(err);
	res.json({status:false,msg:'not found session'});
});
*/