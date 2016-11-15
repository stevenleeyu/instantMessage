var amqp = require("amqp");
var exchName = "weTransnExchange"; //exhange 名称
var routeKey = "we.transn.imsn"; // 路由键

var connOptions = {
    host: "10.5.123.110"
    ,port: 5672
    ,login: "woordee_develop"
    ,password: "woordee-rabbitmq-123456"
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

var messOption = {
    contentEncoding: "utf-8"
    ,deliveryMode: 1
}

var message = {test:123,name:123};
var conn = amqp.createConnection(connOptions); //连接rabbitmq
var n=60; // 循环数
var messFunc = function(e){
    console.log(e);
}

var exchFunc = function(exchange){
    now = new Date();
    mill = now.getMilliseconds();
    console.log(now,mill);
//[此处是我问题的点]
    for (var i = 1; i <=n; i++) {
        message.no = i+100;
        exchange.publish(routeKey,JSON.stringify(message), "", messFunc); //发布消息 因为exchange属性confirm为false，此处不会回调messFunc
    }
    now = new Date();
    mill = now.getMilliseconds();
    console.log(now,mill);
}

var connFunc = function(){
    console.log("ready");
    var exch = conn.exchange(exchName,exchOption,exchFunc); //获取exchange 生成生产者
}

conn.on("ready", connFunc); //rabbitmq连接成功调用connFunc