/**
 * 保持代码整洁优雅，享受编程
 * @author lgzhang08@gmail.com
 * 程序主文件
 */

'use strict';
var redis = require('redis') // reids
var app    = require('express')();        // call express
var querystring = require('querystring');

const config = require('../config/config')                 // 配置文件
// const initConnect = require('./initConnect')               // 初始化链接

// 初始化api
var routes = require('./api/init');
routes(app);
// 启动服务的时候监听端口号
const server = app.listen(config.apiPort,function(){
    console.log('Api Server listening on port:',config.apiPort);
});