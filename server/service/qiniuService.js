var qiniu = require("qiniu");
module.exports = {
    uploadFile: function(filePath, fileName, callback){
        //需要填写你的 Access Key 和 Secret Key
        qiniu.conf.ACCESS_KEY = global.qiniuConfig.ACCESS_KEY;
        qiniu.conf.SECRET_KEY = global.qiniuConfig.SECRET_KEY;
        //要上传的空间
        var bucket = 'instantmessage';

        //构建上传策略函数
        function uptoken(bucket, key) {
            var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
            return putPolicy.token();
        }

        //生成上传 Token
        token = uptoken(bucket, fileName);

        var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(token, fileName, filePath, extra, function(err, ret) {
            if(typeof callback != 'undefined'){
                callback(err, ret);
            }
        });
    }
}