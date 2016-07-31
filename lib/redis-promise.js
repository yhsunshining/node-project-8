/**
 * Created by royhyang on 2016/7/31.
 */

var client = require('./redis');

var Client = function() {

}

var methods = ['get', 'set']



function Factory(name) {
    return function(key, callback) {
        if (callback && typeof callback === 'function') {
            return client[name](...arguments);
        }
        else {
            return new Promise(function(resolve, reject) {
                client[name](key, function(err,data){
                    if(err){
                        console.log(err);
                        reject(err)
                    }
                    else {
                        resolve(data);
                    }
                })
            })
        }
    }
}
for (var i = 0; i < methods.length; i++) {
    Client.prototype[methods[i]] = Factory(methods[i])
}

module.exports = Client;