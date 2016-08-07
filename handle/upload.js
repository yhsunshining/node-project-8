/**
 * Created by royhyang on 2016/7/15.
 */
"use strict";
var router = require('express').Router();
const printer = require("../lib/printer");
const util = require('../lib/util');
const co = require('co')
const redisClient = require('../lib/redis-promise');

module.exports.delRedis = (req,res,data)=>co(function* (){
    const print = printer(req, res);
    data = JSON.parse(data);
    let fileInfo = data.fileInfo;
    try {
        console.log(fileInfo);
        if (fileInfo) {
            let labels = [];
            if (fileInfo.name) {
                labels.push(fileInfo.name)
            }
            let meta = fileInfo.meta;
            if (meta) {
                if (meta.author) {
                    labels.push(meta.author);
                }
                if (meta.labels) {
                    labels.push(meta.labels);
                }
                if (meta.alt) {
                    labels.push(meta.alt);
                }
            }
            let result = yield redisClient.smembers('keys');
            if(result.length>0){
                var regs = [];
                var buffer = [];
                result.forEach(function(key){
                    var keyword = key.match(/^(.*)\\.*\\.*$/)[1];
                    if(keyword) {
                        var reg = new RegExp('^.*'+util.escapeRegExp(keyword)+'.*$');
                        labels.forEach(function(label){
                            if(reg.test(label)){
                                buffer.push(key)
                            }
                        })
                    }
                });
                if(buffer.length){
                    yield redisClient.del(buffer);
                    yield redisClient.srem('keys',buffer);
                }
            }
        }
    }
    catch (e){
        console.log(e);
    }
    finally  {
        return console.log('end');
    }
});
