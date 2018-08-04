/**
 * 保持代码整洁优雅，享受编程
 * @author lgzhang08@gmail.com
 * 
 * 日志  { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
 */

var winston = require('winston');

module.exports = new (winston.Logger)({
	exitOnError: false, //don't crash on exception
	transports: [
	  new (winston.transports.Console)({
      timestamp: function() {
      	// 格式化时间
      	var time = new Date()
        return time.toLocaleDateString()+ " "+ time.toLocaleTimeString();
      },
      formatter: function(options) {
        // Return string will be passed to logger.
        return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
      }
    }),
    new winston.transports.File({ filename: 'logs/error-'+ new Date().toLocaleDateString() +'.log', level: 'error', name: 'file.error',maxsize: 102400,maxFiles: 10, handleExceptions: true,json: false}),
    new winston.transports.File({ filename: 'logs/info-'+ new Date().toLocaleDateString() +'.log', level: 'info', name: 'file.info',maxsize: 102400,maxFiles: 10, handleExceptions: true,json: false}),
//  new winston.transports.File({ filename: 'logs/debug.log', level: 'debug', name: 'file.debug' })
	]
});
