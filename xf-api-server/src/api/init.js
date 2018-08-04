/**
 * 保持代码整洁优雅，享受编程
 * @author lgzhang08@gmail.com
 * 
 * init api
 */
var express = require('express');
var bodyParser = require('body-parser')

module.exports = function(app){
    // 讯飞api
    var xf = require('./xf');
	// app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}));
	// app.use(bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoding' }));
	xf(app);
	
	// app.use('/xf',xf);
};