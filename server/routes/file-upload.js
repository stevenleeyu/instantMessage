var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var qiniuService = require('../service/qiniuService');
module.exports = function ( app ) {
    app.post('/file-upload', multipartMiddleware, function(req, res) {
        // 获得文件的临时路径
        //console.log(req.files);
        qiniuService.uploadFile(req.files.file.path, req.files.file.originalFilename, function(err, ret){
            if(!err) {
                //res.end('<script type="text/javascript">window.name = "I was there!";</script>');
                // 上传成功， 处理返回值
                res.json({
                    'code': 0, //0表示成功，其它表示失败
                    'msg': '', //失败信息
                    'data': {
                        'src': global.qiniuConfig.DOWNLOAD_URL+ret.key, //文件url
                        'name': ret.key //文件名
                    }
                });
                //res.json({status:true,msg:'upload success!',url:'http://ocpofo0bq.bkt.clouddn.com/'+ret.key});
            } else {
                // 上传失败， 处理返回代码
                res.json({
                    'code': 1 //0表示成功，其它表示失败
                    ,'msg': 'upload faild!' //失败信息
                });
                //res.json({status:true,msg:'upload faild!'});
            }
        });

    });
}