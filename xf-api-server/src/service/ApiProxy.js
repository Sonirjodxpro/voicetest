/**
 * 保持代码整洁优雅，享受编程
 * @author lgzhang08@gmail.com * 
 * 
 * 讯飞语音识别 代理
 */

const md5 = require('md5');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const streamBuffers = require('stream-buffers');;
const request = require('request');

// const Logger = require('../service/Logger')                 // 日志
const config = require('../../config/config')                 // 配置文件


class ApiProxy {
	 // 构造  
    constructor() {
    	
    }
    
    /**
     * 修改header
     */
    setHeaders(body) {
		// var params = {"auf":"8k","aue":"raw", "scene":"main",spx_fsize: 60}
		var params = {"auf":"8k","aue":"raw","scene":"main"}
		const paramsToBase64 = new Buffer(JSON.stringify(params)).toString('base64')
		const nowTime = Math.floor(new Date().getTime()/1000);
  		return {
  			'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
			'X-Appid': config.xfApi.Appid,
			'X-CurTime': nowTime,
			'X-Param': paramsToBase64,
			'X-CheckSum': md5(config.xfApi.ApiKey + nowTime + paramsToBase64  + body),
			'Content-Length': Buffer.byteLength(body)
		}
		
		
		return proxyReq;
    }
    
	/**
	 * body编码，将内容base64编码
	 */
    encodeBody(body) {
		body = Object.keys(body).map(function (key) {
			return key + '=' + new Buffer(body[key]).toString('base64');
		}).join('&');
		return body
	}
	
	/**
	 * mp3文件转码 wav
	 */
	mp3ToWav(file, res) {
		var that = this
		
		let myWritableStreamBuffer = new streamBuffers.WritableStreamBuffer({
			initialSize: (1000 * 1024),   // start at 100 kilobytes.
			incrementAmount: (100 * 1024) // grow by 10 kilobytes each time buffer overflows.
		});
		
		ffmpeg(file)
			// .inputFormat('mp3')
			.on('start', function(commandLine) {
				console.log('Spawned Ffmpeg with command: ' + commandLine);
			})
			.on('error', function(err, stdout, stderr) {
				console.log('ffmpeg error: ' + err);
				res.send('转码错误，请重试！')
			})
			.on('end', function() {
				let buffer = myWritableStreamBuffer.getContents();
				myWritableStreamBuffer.end();
				that.audioToText(res, buffer)
				console.log('Processing finished !');
				
			})
			// 写入stream，必须要指定格式
			.toFormat('wav')
			// 命令 ffmpeg -i test2 -acodec pcm_s16le -ac 1 -ar 8000 test3xf5.wav
			.outputOptions(['-acodec pcm_s16le', '-ac 1', '-ar 8000'
			])
			.writeToStream(myWritableStreamBuffer)
	}
	
	
	/**
	 * 讯飞语音识别
	 */
	audioToText(res, bufferBody) {
			var body = this.encodeBody({data:bufferBody})
			var options = {
				url: config.xfApi.Server + '/v1/aiui/v1/iat',
				// url: config.xfApi.Server + '/v1/aiui/v1/voice_semantic',
				method: "POST",
				headers: this.setHeaders(body),
				body: body
				
			}
			
			console.log(options.url, options.headers)
			// api 请求
			request(options, function(error, response) {
				if (!error && response.statusCode == 200) {
					console.log('response.body:', response.statusCode, JSON.parse(response.body).data)
					res.send(JSON.parse(response.body).data)
				} else {
					console.log('识别错误，请重试！')
					res.send('识别错误，请重试！')
				}
			});
	}
}
  
// 单例模式
module.exports = new ApiProxy()