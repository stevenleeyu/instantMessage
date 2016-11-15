/**
 * Created by Transn on 2016-11-14.
 */
var
    funcs,
    crypto = require('crypto'),
    co = require('co');

funcs = {
    // 管理员账号加密
    encrypt: function (pwd) {
        return crypto.createHash('md5').update(pwd).digest('hex');
    },
    // 格式化日期
    date: require('mo2js').date,
    // wrap co
    co: function(success, error) {
        co(success).catch(error)
    },
    // node命令中的参数
    argv: require('minimist')(process.argv.slice(2))
}

module.exports = funcs;
