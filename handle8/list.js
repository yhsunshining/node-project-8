/**
 * Created by royhyang on 2016/7/15.
 */
var router = require('express').Router();
var redisClient = require('../lib/redis');

router.get('/',function(req,res){
    const params = request.query;
    const keyword = params.search;
    
    res.send(keyword);
});