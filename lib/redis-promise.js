/**
 * Created by royhyang on 2016/7/31.
 */

var client = require('./redis');

var Client = function() {

}

function defaultCallback(err,data) {
    if(err){
        reject(err);
    }
    return resolve(data);
}

Client.prototype.get = function(key, callback) {
    if (callback && typeof callback === 'function') {
        return client.get(...arguments);
    }
    else {
        return new Promise(function(resolve, reject) {
            client.get(key,defaultCallback)
        })
    }
}