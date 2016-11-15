(function() {
    // 配置
    var envir = 'develop';
    var configMap = {
        develop: {
            url: 'http://127.0.0.1:88'
        },
        online: {
			url: 'http://127.0.0.1:88'
        }
    };
    window.CONFIG = configMap[envir];
}())