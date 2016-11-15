var mycrypto = require('../common/mycrypto');
module.exports = {
    login: function(username, password,callback){
        var result={status:false,msg:'not find user'};
        F.co(function *() {
            // 查询数据库
            var User = global.dbHelper.getModel('user');

            if(username == '' || password == ''){
                callback(result);
                return;
            }

            var userInfo = yield User.findOne({"username":username,"password":mycrypto.md5(password)});
            if(userInfo){
                result.status = true;
                result.msg = 'login success';
                result.user = userInfo;
                callback(result);
                return;
            }else{
                callback(result);
                return;
            }
        },function(){
            result.msg = 'mongo err';
            callback(result);
            return;
        });
    }
}