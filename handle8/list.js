/**
 * Created by royhyang on 2016/7/15.
 */
var router = require('express').Router();
const printer = require("../lib/printer");

router.get('/', function(req, res) {
    const params = req.query;
    const keyword = params.search || '';
    let pageIndex = +params.pageIndex;
    let pageSize = +params.pageSize;
    let start = 0;
    // see if user has request for a paging
    if (!isNaN(pageIndex) && !isNaN(pageSize)) {
        pageIndex = pageIndex || 0;
        pageSize = pageSize || 10;
        start = pageIndex * pageSize;
    }
    var redisClient = require('../lib/redis');
    redisClient.select('1', function(error) {
        if (error) {
            console.log(error);
            res.send(error)
        }
        else {
            var key = keyword + '\\' + pageIndex + '\\' + pageSize;
            redisClient.get(key,function(err,result) {
                if(err){
                    console.log(err);
                    res.send(err);
                }
                else {
                    if(result){
                        res.send(result);
                    }
                    else {
                        res.send('keyword:' + keyword);
                    }
                }
            })
        }
    });
});

var addRedis = function(keyword, res) {
    var redisClient = require('../lib/redis');
    redisClient.select('1', function(err) {
        if (err) {
            console.log(err);
            return;
        }
        else {
            var key = keyword + '\\' + res.paging.pageIndex + '\\' + res.paging.pageSize;
            redisClient.set(key,JSON.stringify(res),function(err,result) {
                if(err){
                    console.log(err);
                    return err;
                }
                else {
                    redisClient.expire(key,5*60);
                }
            })
        }
    });
};


module.exports = router;