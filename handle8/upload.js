module.exports.delRedis = function(req,res,data){
    const print = printer(req, res);
    let fileInfo = data.fileInfo;
    try {
        if (fileInfo) {
            let labels = [];
            if (fileInfo.name) {
                labels.push(data.name)
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
            var redisClient = require('../lib/redis');
            labels.forEach(function(item) {
                redisClient.smembers(item,function(err,result) {
                    if(err){
                        throw err
                    }
                    else {
                        redisClient.del(result);
                        redisClient.srem(item,result);
                    }
                })

            })
        }
    }
    catch (e){
        console.log(e);
    }
    finally  {
        print(data);

    }
};

/**
 * Created by royhyang on 2016/7/15.
 */
"use strict";
var router = require('express').Router();

const printer = require("../lib/printer");
