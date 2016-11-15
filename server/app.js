//建立MongoDB连接, 根据自己环境修改相应的数据库信息
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var multer = require('multer');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var mongoose = require("mongoose");

global.POLLING_INTERVAL = 1000;
global.connectionsArray = [];
global.dbHelper = require('./common/dbHelper');
global.db = mongoose.connect("mongodb://127.0.0.1:27017/notify");

global.dingURL = "钉一下发短信接口";
global.qiniuConfig = {
	//七牛云帐号
	ACCESS_KEY: '',
	SECRET_KEY: '',
	DOWNLOAD_URL: ''
};
global.mqConfig = {
	//rabbit-mq 配置
	host: "",
	port: 5672,
	login: "",
	password: "",
	exchName: "",
	routeKey: ""
};
global.avatarList = {
	'mine':'http://filemanager.woordee.com/tx01.png',
	'other':'http://filemanager.woordee.com/tx02.png',
	'group':'http://filemanager.woordee.com/tx03.png'
};
global.F = require('./common/function');

var	loginService = require('./service/loginService');
var	notifyService = require('./service/notifyService');
var	instantMessageService = require('./service/instantMessageService');

// 设定views变量，意为视图存放的目录
app.set('views', path.join(__dirname, 'views'));
app.set( 'view engine', 'html' );
app.engine( '.html', require( 'ejs' ).__express );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(multer());

app.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	next();
});
//app.all('*', function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "X-Requested-With");
//    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//    res.header("X-Powered-By",' 3.2.1')
//    res.header("Content-Type", "application/json;charset=utf-8");
//    next();
//});

require('./routes')(app);
//启动HTTP服务，绑定端口88
server.listen(88);

// 创建一个websocket连接，实时更新数据
io.sockets.on('connection', function(socket) {
	console.log('new client connect!');
	console.log('connect num:' + global.connectionsArray.length);
  
	//登陆验证
	socket.on('login', function(obj){
		//将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
		//console.log(obj);
		loginService.login(obj.username, obj.password, function(data){
			if(data.status){
				socket.user = data.user;
				global.connectionsArray.push(socket);
			}
			socket.emit('login', data);
		});
	});

	//获取未读消息
	socket.on('unreadMessage', function(){
		notifyService.unreadMessage(socket);
	});
	
	//设置当前会话
	socket.on('setCurrSession', function(data){
		instantMessageService.setCurrSession(socket, data.sessId);
	});

	//关闭即使通讯
	socket.on('emptyCurrSession', function(data){
		instantMessageService.emptyCurrSession(socket);
	});
	
	//关闭当前会话
	socket.on('unsetSession', function(data){
		socket.user.currSession = null;
	});
	
	//监听发消息
	socket.on('sendMessage',function(data){
		instantMessageService.sendMessage(socket, data);
	});

	//断开连接
	socket.on('disconnect', function() {
		var socketIndex = global.connectionsArray.indexOf(socket);
		console.log('socket = ' + socketIndex + ' disconnected;');
		if (socketIndex >= 0) {
			connectionsArray.splice(socketIndex, 1);
		}
	});
  
});

