/**
 * Created by royhyang on 2016/7/15.
 */
'use strict';

var redis = require('redis');
const config = require('../config/redisConfig');
var client = redis.createClient(config.port, config.ip, config.options);

client.on('ready',function(res){
    console.log('ready');
});

client.on('error', function (err) {
    console.log(err);
    return ;
});

module.exports = client;
