/**
 * Created by royhyang on 2016/7/15.
 */
"use strict";

var router = require('express').Router();
const printer = require("../lib/printer");
const co = require('co')
var redisClient = require('../lib/redis-promise');

module.exports.checkRedis = (req,res,callback) =>co(function* (){
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
    var key = keyword + '\\' + pageIndex + '\\' + pageSize;
    try {
        var result = yield redisClient.get(key);
        if(result) {
            console.log('hit');
            print(JSON.parse(result));
            return ;
        }
        else {
            callback();
        }
    }
    catch (redisErr){
        console.log(err);
        print(err);
        return ;
    }
});

module.exports.addRedisALL = (req,res,data) => co(function* (){
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
    try{
        var result = yield redisClient.sadd('keys',key);
        console.log(result);
        result = yield redisClient.set(key,data);
        console.log(result);
        result = yield redisClient.expire(key,5*60);
        console.log(result);
        console.log('expire in 5 minutes.');
        return ;
    }
    catch (redisErr){
        console.log(err);
        return err;
    }
});
