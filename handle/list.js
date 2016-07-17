/**
 * Created by royhyang on 2016/7/15.
 */
"use strict";

var router = require('express').Router();
const printer = require("../lib/printer");


module.exports.checkRedis = function(req, res,callback) {
    const params = req.query;
    const keyword = params.search || '';
    let pageIndex = +params.pageIndex;
    let pageSize = +params.pageSize;
    let start = 0;
    const print = printer(req, res);

    // see if user has request for a paging
    if (!isNaN(pageIndex) && !isNaN(pageSize)) {
        pageIndex = pageIndex || 0;
        pageSize = pageSize || 10;
        start = pageIndex * pageSize;
    }
    var redisClient = require('../lib/redis');
    var key = keyword + '\\' + pageIndex + '\\' + pageSize;
    redisClient.get(key, function(err, result) {
        if (err) {
            console.log(err);
            print(err);
            return ;
        }
        else {
            if (result) {
                console.log('hint')
                print(JSON.parse(result));
                return ;
            }
            else {
                callback();
            }
        }
    })
};

module.exports.addRedis = function(req,res,data) {
    const print = printer(req, res);

    const params = req.query;
    const keyword = params.search || '';
    let pageIndex = +params.pageIndex;
    let pageSize = +params.pageSize;
    let key = keyword + '\\' + pageIndex + '\\' + pageSize;
    if (!isNaN(pageIndex) && !isNaN(pageSize)) {
        pageIndex = pageIndex || 0;
        pageSize = pageSize || 10;
    }
    var redisClient = require('../lib/redis');
    redisClient.sadd(keyword,key,function(err,result) {
        if(err) {
            console.log(err);
            return err;
        }
        else {
            redisClient.set(key,data, function(err, result) {
                if (err) {
                    console.log(err);
                    return err;
                }
                else {
                    redisClient.expire(key, 5 * 60);
                    console.log('expire');
                    return;
                }
            });
        }
    })
};

module.exports.addRedisALL = function(req,res,data) {
    const print = printer(req, res);

    const params = req.query;
    const keyword = params.search || '';
    let pageIndex = +params.pageIndex;
    let pageSize = +params.pageSize;
    let key = keyword + '\\' + pageIndex + '\\' + pageSize;
    if (!isNaN(pageIndex) && !isNaN(pageSize)) {
        pageIndex = pageIndex || 0;
        pageSize = pageSize || 10;
    }
    var redisClient = require('../lib/redis');
    redisClient.sadd('keys',key,function(err,result) {
        console.log('keys');
        if(err) {
            console.log(err);
            return err;
        }
        else {
            redisClient.set(key,data, function(err, result) {
                if (err) {
                    console.log(err);
                    return err;
                }
                else {
                    redisClient.expire(key, 5 * 60);
                    console.log('expire');
                    return;
                }
            });
        }
    })
};