(function() {
    // 配置
    /* url im服务地址
     * dingSwitch 钉一下功能开关
     * language 语言包 仅en有效
     *****************/
    var envir = 'develop';
    var configMap = {
        local: {
            url: 'http://127.0.0.1:88',
            dingSwitch: true,
            language: 'cn'
        }
    };
    window.CONFIG = configMap[envir];
    window.imIdClass = '.imBtn';
    window.initCallback = typeof initCallbackHandler != 'undefined' ? initCallbackHandler : null;
}())
var superUser = 'administrator';

var username = userCode;
var password = username.toLowerCase();
//console.log(username, password);