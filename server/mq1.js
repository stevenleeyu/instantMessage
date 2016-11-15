global.mqConfig = {
    host: "10.5.123.110",
    port: 5672,
    login: "woordee_develop",
    password: "woordee-rabbitmq-123456",
    exchName: "weTransnExchange",
    routeKey: "we.transn.imsn"
};

var	mqService = require('./service/mqService');

var message = {test:"test message"};

mqService.publishMQ(message);