/**
 * 保持代码整洁优雅，享受编程
 * @author lgzhang08@gmail.com
 * 
 * 初始化连接
 */
// 通用服务

// 指令
const Command = {}

Command.soundCommand = require('./api/xf')              // 用户相关


const PUB = {};

PUB.init = (socket) => {
	// 初始化指令
	for(let command in Command) {
		Command[command].init(socket)
	}	
}

module.exports = PUB;