module.exports = {
	unreadMessage: function(socket){
		//showMem();
		var Session = global.dbHelper.getModel('session');
		var SessionMember = global.dbHelper.getModel('sessionMember');

		if(typeof socket.user == 'undefined'){
			return;
		}
		SessionMember.find({"uId":socket.user._id}).exec(function(err,res){
			var sessIdList = [];
			var readNumList = {};
			res.forEach(function(row){
				sessIdList.push(row.sessId);
				readNumList[row.sessId] = row.readNum;
			});
			Session.find().where('_id').in(sessIdList).exec(function(err,sessions){
				var sessList = [];
				var sum = 0;
				for(var i = 0; i < sessions.length; i++){
					var session = {};
					session.id = sessions[i]._id;
					session.totalNum = sessions[i].totalNum;
					session.readNum = readNumList[sessions[i]._id];
					session.unreadNum = session.totalNum - session.readNum;
					sessList.push(session);
					sum += session.unreadNum;
				}
				socket.volatile.emit('unreadMessage', {sessList:sessList,unreadNum:sum});
			});
		});
	}
};

var showMem = function() {
	var mem = process.memoryUsage();
	var format = function(bytes) {
		return (bytes/1024/1024).toFixed(2)+'MB';
	};
	console.log('------------------------------------------------------------');
	console.log('connect num:' + global.connectionsArray.length);
	console.log('------------------------------------------------------------');
	console.log('Process: heapTotal '+format(mem.heapTotal) + ' heapUsed ' + format(mem.heapUsed) + ' rss ' + format(mem.rss));
	console.log('------------------------------------------------------------');
};