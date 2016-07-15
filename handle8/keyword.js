/**
 * Created by royhyang on 2016/7/15.
 */
var router = require('express').Router();
var redisClient = require('../lib/redis');

router.get('/',function(req,res){
    const params = request.query;
    const keyword = params.search || '';
    let pageIndex = +params.pageIndex;
    let pageSize = +params.pageSize;

    redisClient.on('connect', function(){
        if(redisClient.llen(keyword)>0) {
            res.send(redisClient.lrange(keyword,pageIndex*pageSize,pageSize))
        }
        else {
            res.send(keyword);
        }
    });
});