/**
 * Created by royhyang on 2016/7/31.
 */

var client = require('./redis');
var Client = Object.create(client);


var methodsTwo = ['get','smembers','del']
var methodsThree = ['set', 'sadd', 'expire','srem'];

function Factory(name) {
    return function() {
        var args = [...arguments];
        if (args[args.length-1] === 'function') {
            return client[name](...args);
        }
        else {
            return new Promise(function(resolve, reject) {
                args.push(function(err,data) {
                    if (err) {
                        console.log(err);
                        reject(new Error(err))
                    }
                    else {
                        resolve(data);
                    }
                })
                client[name](...args)
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
    Client[methodsTwo[i]] = Factory(methodsTwo[i])
}
for (let i = 0; i < methodsThree.length; i++) {
    Client[methodsThree[i]] = FactoryThree(methodsThree[i])
}
module.exports = Client;