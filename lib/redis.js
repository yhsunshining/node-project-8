/**
 * Created by royhyang on 2016/7/15.
 */
var redis = require('redis');
// const psw = 'crs-9snxiqbn:QcloudV5';
// const ip = '10.66.123.211';
const ip = '127.0.0.1';
const port = 6379;
const opts = {
    // auth_pass: psw
};
var client = redis.createClient(port, ip, opts);

client.on('ready',function(res){
    console.log('ready');
});

client.on('error', function (err) {
    assert(err instanceof Error);
    assert(err instanceof redis.AbortError);
    assert(err instanceof redis.AggregateError);
    assert.strictEqual(err.errors.length, 2); // The set and get got aggregated in here
    assert.strictEqual(err.code, 'NR_CLOSED');
});

module.exports = client;
