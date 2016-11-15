var amqp = require("amqp");

var connOptions = {
    host: global.mqConfig.host
    ,port: global.mqConfig.port
    ,login: global.mqConfig.login
    ,password: global.mqConfig.password
    ,authMechanism: "AMQPLAIN"
    ,vhost: "/"
    ,ssl:   {
        enabled : false
    }
}

var exchOption = {
    type: "direct"
    ,durable: true
    ,autoDelete: false
    ,confirm: true
}

module.exports = {
    publishMQ: function(message){
        var conn = amqp.createConnection(connOptions); //连接rabbitmq

        conn.on("ready", function(){
            conn.exchange(global.mqConfig.exchName,exchOption, function(exchange){
                exchange.publish(global.mqConfig.routeKey,JSON.stringify(message), "", function(res){
                    console.log('publish return:', res);
                    conn.end();
                    conn.destroy();
                });
            });
        });
    }
}