var mycrypto = require('../common/mycrypto');
module.exports = function ( app ) {
    //创建会话
    app.post("/user/create",function(req,res){
        F.co(function *() {
            var User = global.dbHelper.getModel('user');
            var user = {
                username: req.body.username,
                nickname: typeof req.body.nickname!='undefined' && req.body.nickname!=''?req.body.nickname:req.body.username,
                password: mycrypto.md5(req.body.password)
            };
            //console.log(user);
            var userInfo = yield User.findOne({username:user.username});
            if(userInfo){
                userInfo.password = undefined;
                res.json({status:false,msg:'username has existed',data:userInfo});
            }else{
                userInfo = yield User.create(user);
                if(userInfo){
                    userInfo.password = undefined;
                    res.json({status:true,msg:'create user success',data:userInfo});
                }
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
    });
};