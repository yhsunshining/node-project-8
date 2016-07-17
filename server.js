var express = require('express');
var app = express();
var server = require('http').createServer(app);
var methodOverride = require('method-override');
var request = require('request');
var logger = require('morgan');
var fs = require("fs");
var proxyConfig = require('./config/proxyConfig');
var routesConfig = require('./routes/index');

app.use(logger('dev'));
app.use(require('./middlewares/basicAuth'));
app.use(methodOverride());

// 请求示例：http://127.0.0.1/part4/upload
app.use('/', function(req, res) {
    var pathArr = req.path.split('/');
    // 针对不在配置文件中的路由进行错误处理
    if (!proxyConfig[pathArr[1]] || !routesConfig[req.path]) {
        
        res.status(404).send('Not found:' + req.originalUrl);
        return;
    }
    // 设置转发url
    var targetUrl = 'http://' + proxyConfig[pathArr[1]].host + ':' + proxyConfig[pathArr[1]].port + req.originalUrl.replace(/\/part\d/, '');
    // 重置请求方式
    req.method = routesConfig[req.path].method;
    // 不能使用bodyParser，会把req里数据流进行更改，对pipe方法造成影响
    req.pipe(request(targetUrl)).on('error', function(err) {
        // 处理目标服务器错误
        res.status(404).send('Not found:' + req.originalUrl);
        return;
    }).on('response', function(response) {
        // redis缓存处理
        var bodyChunks = [];
        response.on('data', function(chunk) {
            bodyChunks.push(chunk);
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks);
            //*****do somethings
        });
    }).pipe(res);
});

server.listen(3008);