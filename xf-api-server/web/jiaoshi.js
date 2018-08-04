var socket = io.connect('http://192.168.111.252:33206');
var appid = 'cn.zhl.classinteraction';
var userid = 'teacher123456';
var testid = 'testid';
var testname = 'testname';
var discussid = 'discussid';
var voteid = 'voteid';
var isClassing = false;
var classid = ' '
var teacher = 'TEACHER'

socket.on('connect', function() {
	console.log(':connect');
	socket.emit('uploadUserid', {
		userid: userid,
		appid: appid
	}, function(data) {
		socket.emit('joinGroup',{
			groupid:classid
		},function(){
			socket.emit('forwardGroup',{
				groupid:classid,
				appid:appid,
				role:teacher
			})
		})
	})
});
socket.on('disconnect', function() {
	console.log(':disconnect');
});
socket.on('forward', function(data) {
	console.log('forward', data);
	if(data.command&&data.command==='getClassStatus'){
		var studentid=data.studentid;
		answerClassStatus(status.value,studentid);
	}
});
socket.on('forwardGroup', function(data) {
	console.log('forwardGroup', data);
	
});
socket.on('joinGroup', function(data) {
	console.log('joinGroup', data);
	console.log(io)
	socket.emit('forward',{
		userid:data.userid,
		appid:appid,
		role:teacher
	},function(message){
		console.log(message)
	})
});
socket.on('leaveGroup', function(data) {
	console.log('leaveGroup', data);
});

var publishTest=function(){
	socket.emit('forwardGroup',{
		appid:appid,
		command:'publistTest',
		params:{
			testid:testid,
			testName:testname
		}
	});
}

var openTest=function(){
	socket.emit('forwardGroup',{
		appid:appid,
		command:'openTest',
		params:{
			testid:testid,
		}
	});
}

var forceCommit=function(){
	socket.emit('forwardGroup',{
		appid:appid,
		command:'forceCommit',
		params:{
			testid:testid,
		}
	});
}

var openDiscuss=function(){
	socket.emit('forwardGroup',{
		appid:appid,
		command:'openDiscuss',
		params:{
			discussid:discussid,
		}
	});
}

var stopDiscuss=function(){
	socket.emit('forwardGroup',{
		appid:appid,
		command:'stopDiscuss',
		params:{
			discussid:discussid,
		}
	});
}

var openVote=function(){
	socket.emit('forwardGroup',{
		appid:appid,
		command:'openVote',
		params:{
			voteid:voteid,
		}
	});
}

var changeClassStatus=function(classing){
	isClassing = classing;
	socket.emit('forwardGroup',{
		appid:appid,
		command:'changeClassStatus',
		params:{
			isClassing:isClassing,
		}
	});
}

var answerClassStatus=function(classing,studentid){
	isClassing = classing;
	socket.emit('forward',{
		appid:appid,
		userid:studentid,
		command:'answerClassStatus',
		params:{
			isClassing:isClassing,
		}
	});
}

publishTestBtn.onclick=publishTest;
openTestBtn.onclick=openTest;
forceCommitBtn.onclick=forceCommit;
openDiscussBtn.onclick=openDiscuss;
stopDiscussBtn.onclick=stopDiscuss;
openVoteBtn.onclick=openVote;
changeClassStatusBtn.onclick=function(){
	changeClassStatus(status.value)
}
