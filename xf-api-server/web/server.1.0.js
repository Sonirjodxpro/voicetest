// 客户端流程
// 1.建立连接http://192.168.111.208:8000
// 2. emit('uploadUserid',{userid:userid}) userid字符串
// 
// 客户端功能 发消息
// 1. 向某人发消息 emit('forward',{targetid:targetid,...}) targetid必选，值为userid
// 2. 向某群发消息 emit('forwardGroup',{targetid:targetid,...}) targetid必选，值为groupid
// 3. 加入群，该群不存在时自动创建 emit('joinGroup',{groupid:groupid}) groupid字符串
// 4. 退出群， emit('leaveGroup',{groupid:groupid}) groupid字符串
// 客户端功能 收消息
// 1. on('forward',function(data){}) 收到某人发的消息，data.time发送时间，data.data发送的数据
// 2. on('forwardGroup',function(data){}) 收到某群发的消息，data.time发送时间，data.data发送的数据
// 3. on('system',function(data){}) 用户加入离开群时发的消息，data.time发送时间，data.action值为join或leave data.userid 用户id
// 

var port=33206;
var namespace='/';
var io=require('socket.io').listen(port);
var socketid2userid={};
var userid2socketid={};
var onLineList={};
var websocket=io.on('connection',function(socket){
	
	console.log(socket.id);

	var leaveGroup=function(groupid){
		var info={
			userid:socketid2userid[socket.id],
			time:Date.now(),
			action:'leave',
			groupid:groupid
		}
		socket.leave(groupid);
		if(socket.joinedRooms[groupid]) delete socket.joinedRooms[groupid];
		if(onLineList[groupid]) delete onLineList[groupid];
		// console.log('rooms',io.of(namespace).adapter.rooms);
		io.sockets.in(groupid).emit('system',info)
	}

	// 上传userid
	socket.on('uploadUserid',function(data){
		console.log('uploadUserid',data);
		var appid=data.appid;
		socket.appid=appid;
		socket.userid=data.userid;
		socketid2userid[socket.id]=data.userid;
		userid2socketid[data.userid]=userid2socketid[data.userid] || {}
		userid2socketid[data.userid][appid]=socket.id;
		io.sockets.emit('login',{time:Date.now(),userid:data.userid});
		// socket.join('english');
		console.log('userid2socketid',userid2socketid)
		// console.log('io.of',io.of(namespace));
	})
	//断开连接
	socket.on('disconnect',function(){
		console.log('socket.joinedRooms=',socket.joinedRooms)
		for(var room in socket.joinedRooms){
			leaveGroup(room);
		}
		if(userid2socketid[socket.userid][socket.appid]) delete userid2socketid[socket.userid][socket.appid]
	})
	//加入群，如果不存在，创建
	socket.on('joinGroup',function(data){
		console.log('joinGroup',data);
		var groupid=data.groupid;
		var userid=socketid2userid[socket.id];
		var info={
			userid:userid,
			time:Date.now(),
			action:'join',
			groupid:groupid
		}
		onLineList[groupid]=onLineList[groupid] || {};
		onLineList[groupid][userid]=userid2socketid[userid];
		socket.joinedRooms=socket.joinedRooms || {};
		socket.joinedRooms[groupid]=true;
		socket.join(groupid);

		// console.log('rooms',io.of(namespace).adapter.rooms);
		io.sockets.in(groupid).emit('system',info)
		// console.log('io=',io);
		
		// console.log('io rooms=',io.sockets.adapter.rooms)
		// console.log('socket.rooms=',socket.rooms)
		// socket.rooms has bugs,it never has the rooms that socket joined except the socket.id itself
		// 
		var info={
			time:Date.now(),
			groupid:data.groupid,
			onLineList:onLineList[groupid]
		}
		console.log(info)
		socket.emit('onLineList',info);
	})
	// 退出群
	socket.on('leaveGroup',leaveGroup);
	

	// 转发到个人
	socket.on('forward',function(data){
		var time=Date.now();
		var targetid=data.targetid;
		var appid=data.appid;
		// console.log('targetid=',targetid)
		// console.log('socket.namespace',userid2socketid[targetid],socket.namespace.sockets);
		console.log(data)
		if(appid){
			socket.broadcast.to(userid2socketid[targetid][appid]).emit('forward',{time:time,data:data});
		}else{
			for(app in userid2socketid[targetid]){
				socket.broadcast.to(userid2socketid[targetid][app]).emit('forward',{time:time,data:data});
			}
		}
		
	})
	// 转发到群
	socket.on('forwardGroup',function(data){
		var time=Date.now();
		var targetid=data.targetid;
		console.log(data);
		socket.broadcast.to(targetid).emit('forwardGroup',{time:time,data:data});
	})
})