/**
 * 保持代码整洁优雅，享受编程
 * @author lgzhang08@gmail.com
 * 
 * 掉线断开连接
 */

// 对外接口
const PUB = {
	USERID_EMPTY: 'userId为空',
	USER_KICKOUT: '账号在其他地方登录,被强制踢出',
	
	APPID_EMPTY: 'appId为空',
	UPLOADUSERID_SUCCESS: '用户上传成功',
	
	ROOMID_EMPTY: 'groupId为空',
	JOINROOM_SUCCESS: '加入教室成功',
	LEAVEROOM_SUCCESS: '退出教室成功',
	CREATEROOM_SUCCESS: '创建教室成功',
	
	ROOMEXIST_SUCCESS: '教室已存在',
	ROOMID_EMPTY: '教室Id为空',
	ROOMNAME_EMPTY: '教室名不存在',
	ROOMLEAVE_SUCCESS:'离开班级成功'
	
}

module.exports = PUB