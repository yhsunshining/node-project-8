/**
 * Created by royhyang on 2016/7/31.
 */

var client = require('./redis');
var Client = Object.create(client);


var methodsTwo = ['get','smembers','del']
var methodsThree = ['set', 'sadd', 'expire','srem'];

function FactoryTwo(name) {
    return function(key, callback) {
        if (callback && typeof callback === 'function') {
            return client[name](...arguments);
        }
        else {
            return new Promise(function(resolve, reject) {
                client[name](key, function(err, data) {
                    if (err) {
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
function FactoryThree(name) {
    return function(arg1, arg2, callback) {
        if (callback && typeof callback === 'function') {
            return client[name](...arguments);
        }
        else {
            return new Promise(function(resolve, reject) {
                client[name](arg1, arg2, function(err, data) {
                    if (err) {
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

for (let i = 0; i < methodsTwo.length; i++) {
    Client[methodsTwo[i]] = FactoryTwo(methodsTwo[i])
}
for (let i = 0; i < methodsThree.length; i++) {
    Client[methodsThree[i]] = FactoryThree(methodsThree[i])
}
module.exports = Client;