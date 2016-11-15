var mongoose = require("mongoose");
	global.dbHelper = require('./common/dbHelper');
	global.db = mongoose.connect("mongodb://10.5.126.177:27017/notify");
	
	var User = global.dbHelper.getModel('user');
	var user = new User({
		username: 'lee',
		password: '123456'
	})
	user.save(function(err) {
		if (err) {
			console.log('error')
			return;
		}
	});
	
	var Article = global.dbHelper.getModel('article');
	var article = new Article({
		title: 'test',
        uId: '57bc0db051617a230845ee43',
        author: 'lee',
        description: '123'
	})
	article.save(function(err) {
		if (err) {
			console.log('error')
			return;
		}
	});
	
	var Message = global.dbHelper.getModel('message');
	var message = new Message({
		uId: '57bc0db051617a230845ee43',
        unread: 4
	})
	message.save(function(err) {
		if (err) {
			console.log('error')
			return;
		}
	});
	
	//保存数据库
	User.find({},function(error,userInfo){
		console.log(User,error,userInfo);
	});