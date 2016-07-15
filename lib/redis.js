/**
 * Created by royhyang on 2016/7/15.
 */
var redis = require('redis');
const psw = 'crs-9snxiqbn:QcloudV5';
const ip = '10.66.123.211';
const port = 6379;
const opts = {
    auth_pass: psw
};
var client = redis.createClient(port, ip, opts);

client.on('ready',function(res){
    console.log('ready');
});

client.on("error", function (err) {
    console.log("Error " + err);
});

module.exports = client;
