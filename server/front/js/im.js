var param = window.location.href.split('#');
var password = param.pop() || '123456';
var username = param.pop() || 'lee';
console.log(username,password);
var serviceList = {sList:['test','unreadMessage']};
// 创建websocket连接
var socket = io.connect(CONFIG.url);
socket.on('connect', function(){
	socket.emit('login', {username:username,password:password});
	
	// 把信息显示到div上
	socket.on('login', function (data) {
		console.log(data);
		if(data.status){
			socket.emit('regServ', serviceList);
			
		}else{
			console.log(data.msg);
		}
	});
	
	// 把信息显示到div上
	socket.on('myArticle', function (data) {
		console.log(data);
		if(data){
			var articlesList = "<dl>";
			$.each(data.articles,function(index,article){
				articlesList += "<dt>" + article.title + "</dt>\n" +
							 "<dd>" + article.author + "\n" +
							 "<dd>" + article.description + "\n"
							 "</dd>";
			});
			articlesList += "</dl>";
			$('#container').html(articlesList);
	   
			$('time').html('最后更新时间:' + data.time);
		}
	});
	socket.on('unreadMessage', function (data) {
		console.log(data);
		if(data){
			$('message').html('未读消息数:' + data.unreadNum);
		}
	});
	socket.on('test', function (data) {
		console.log(data);
		if(data){
			$('time').html('未读消息数:' + data);
		}
	});
	socket.on('instantMessage', function(messList){
		console.log(123,messList);
		messList.forEach(function(mess){
			var html = '<p>'+mess.userInfo.username+':'+mess.content+'/'+mess.sendTime+'</p>';
			$("#list").append($(html));
		});
		//$.each(messList,function(mess){
        //
        //
		//});
	})
});
$(function(){
	$('#cancel').click(function(){
		console.log(serviceList);
		socket.emit('cancelServ', serviceList);
	});
	$('#openIM').click(function(){
		$('#instantMessage').show();
		socket.emit('instantMessage', {sessId:'57c3a045ea7200a41f7301ac'});
	});
	$('#sendMessage').click(function(){
		var content = $('#message').val();
		if(content == ''){
			alert('empty');
			return;
		}
		$('#message').val('');
		$.ajax({
			type: 'POST',
			url: CONFIG.url+'/chat/send',
			dataType: "json",
			timeout: 20000,
			data: {username:username,sessId:'57c3a045ea7200a41f7301ac',content:content},
			beforeSend: function(XMLHttpRequest) {

			},
			success: function(data, textStatus) {

			}
		});
	});
	$('#closeIM').click(function(){
		$('#instantMessage').hide();
		socket.emit('cancelIM', {});
	});

});