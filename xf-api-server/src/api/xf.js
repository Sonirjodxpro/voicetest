/**
 * 保持代码整洁优雅，享受编程
 * @author lgzhang08@gmail.com
 * 
 * 语音
 */

const ApiProxy = require('../service/ApiProxy');

const multer  = require('multer')
const upload = multer({dest: 'tmp/'})

// body =  ApiProxy.mp3ToWav('tmp\\86904cca63818cf15e7103f9f2258cfd')
// ApiProxy.mp3ToWav('tmp\\weixin', '')

module.exports = function(app){
	// 处理get请求
	app.get('/', function(req, res) {
		res.send('welcome to xunfei api server');
	});

	// 处理POST请求
	app.post('/audiotext', upload.any(), function(req,res,next){
		console.log('form data:', req.files);
		if(!! req.files) {
			ApiProxy.mp3ToWav('tmp/' + req.files[0].filename, res)
		} else {
			res.send('文件为空！')
		}
	});
};