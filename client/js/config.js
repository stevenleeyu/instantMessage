(function() {
    // 配置
    /* url im服务地址
     * dingSwitch 钉一下功能开关
     * language 语言包 仅en有效
     *****************/
    var envir = 'local';
    var configMap = {
        local: {
            url: 'http://127.0.0.1:88',
            dingSwitch: true,
            language: 'cn'
        }
    };
    window.CONFIG = configMap[envir];
    window.imIdClass = '#showBox';
    window.initCallback = typeof initCallbackHandler != 'undefined' ? initCallbackHandler : null;
}())
var superUser = 'administrator';
function initCallbackHandler(data){
    console.log(data);
}

//var username = userCode;
//var password = userCode.toLowerCase();
var param = window.location.href.split('#');
var password = param.pop() || '123456';
var username = param.pop() || 'lee';
console.log(username, password);