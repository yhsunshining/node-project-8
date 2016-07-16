/**
 * Created by royhyang on 2016/7/15.
 */
var redis = require('redis');
const config = require('../config/redisConfig');
const assert = require('assert');
var client = redis.createClient(config.port, config.ip, config.opts);

client.on('ready',function(res){
    console.log('ready');
});

client.on('error', function (err) {
    // assert(err instanceof Error);
    // assert(err instanceof redis.AbortError);
    // assert(err instanceof redis.AggregateError);
    // assert.strictEqual(err.errors.length, 2); // The set and get got aggregated in here
    // assert.strictEqual(err.code, 'NR_CLOSED');
    console.log(err);
    return ;
});

module.exports = client;
