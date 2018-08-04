/**
 * 保持代码整洁优雅，享受编程
 * @author lgzhang08@gmail.com * 
 * 
 * 试题相关 的处理函数
 */
const Logger = require('../service/Logger')                 // 日志

class DoData {
	 // 构造  
    constructor() {
    	
    }
    /**
     * 将json转成 键值对，存入redis用
     */
    jsonToKeyValue(json) {
    	if(json instanceof Object) {
    		let data = []
	    	for(let name in json) {
	    		data.push(name)
	    		data.push(json[name])
	    	}
	    	return data
    	}else{
    		Logger.info('error: not json format!!')
    		return false
    	}
    }
    
    /**
     * 返回json格式统一处理
     */
    responseJson(code, command, data) {
    	let json = {
    		code: code,  // 返回数据是否正确判断，OK正确，error错误
    		command: command,  // 固定写法，同接口名
    		data: data  // 返回数据内容，可以为 string array 和 object
    	}
    	return json
    }
}
  
// 单例模式
module.exports = new DoData()