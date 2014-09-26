// document.write(process.version + '|1');
// console.log(process);
/*var http = require('http');    
server = http.createServer(function (req, res) {    
      res.writeHeader(200, {"Content-Type": "text/plain"});    
      res.end("Hello World\n");    
}).listen(8000);
console.log("httpd start @8000");*/
// console.log(global);
var fs = require('fs'),
    // path = require('path'),
	mongoose = require('mongoose'),
	_ = require('underscore'),
	Segment = require('segment').Segment;

mongoose.connect('mongodb://localhost/haimianbaobao');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('mongodb连接成功');
});
//以下代码应该在数据库连接成功的回调中进行，暂时放在外面
var _path = process.cwd() + '/app/js/db-schema';
fs.readdirSync(_path).forEach(function (file) {
	if (file.indexOf('.js')){
		require(_path + '/' + file);
	} 
})
var User = mongoose.model('User');
User.find(function(err, persons){
	_.each(persons, function(person, index){
		// $('.users').append('<div class="row"><div class="col-md-1">'+person.name+'：'+person.sex+'</div></div>');
	});
});
// var user = new User({'name': 'dui', 'sex': 'female'});
// user.save();
// console.log(user.name);

// 创建分词实例
var segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

//关闭启动画面
setTimeout(function(){
	$('.wecome-wrp').fadeOut();
	$('.study-wrp').show();
}, 1800);

var groupTmpl = '<div class="study-group form-horizontal">'+
			        '<div class="form-group">'+
			          '<label class="col-sm-2 control-label">对:</label>'+
			          '<div class="col-sm-10">'+
			            '<input type="text" class="form-control study-question" placeholder="">'+
			          '</div>'+
			        '</div>'+
			        '<div class="form-group">'+
			          '<label class="col-sm-2 control-label">答:</label>'+
			          '<div class="col-sm-10">'+
			            '<input type="text" class="form-control study-answer" placeholder="">'+
			          '</div>'+
			        '</div>'+
			      '</div>';
//添加一组对话
$('body').on('click', '.add-study-group', function(){
	$(this).before(groupTmpl);
});

//保存输入的条目，并进入对话模式
$('body').on('click', '.save-study', function(){
	var KnowledgeModel = mongoose.model('Knowledge');
	$('.study-group').each(function(k, v){
		var _qItem = $(v).find('.study-question'),
			_q = _qItem.val(),
			_aItem = $(v).find('.study-answer'),
			_a = _aItem.val();
		if(!!_q){
			_q = _.map(segment.doSegment(_q), function(v, k){
				return v.w;
			}).join('^');
			//先去查数据库中是否有相同的问题，如果有，则更新答案；如果没有，就写一条新记录
			KnowledgeModel.find({'question': _q}, function(err, q){
				if(q.length){
					KnowledgeModel.update({'_id': q[0]._id}, {$set:{'answer': _a}}, function(err, ques){
						console.log(err);
					});
				}else{
					var knowledge = new KnowledgeModel({'question': _q, 'answer': _a});
					knowledge.save();
				}
			});
			_qItem.val('');
			_aItem.val('');
			$('.study-wrp').fadeOut();
			$('.chat-wrp').show();
			$('#msg-box').focus();
		}
	});
});
//点击开始玩耍
$('body').on('click', '.play-game', function(){
	$('.study-wrp').fadeOut();
	$('.chat-wrp').show();
	$('#msg-box').focus();
});
//聊天场景，返回学习
$('body').on('click', '#go-back', function(){
	$('.chat-wrp').hide();
	$('.study-wrp').show();
});

//发消息
$('body').on('click', '#send-msg', function(){
	var msg = $('#msg-box').val();
	var sameLength = 0; //比较数据库的question分词数组，与msg的分词数组的相同词的长度
	var ans = 'sorry, i have no answer.';//sameLength最长的那个数据库记录的答案
	if(msg){
		//把消息放入到对话窗口中
		$('.chat-items').append('<li class="chat-item me-sent"><span class="bubble">' + msg + '</span></li>');
		$('#msg-box').val('');
		$('.chat-items-wrp').scrollTop($('.chat-items').height() - $('.chat-items-wrp').height());
		var KnowledgeModel = mongoose.model('Knowledge');
		KnowledgeModel.find(function(err, kn){
			if(kn.length){
				var msgSeg = _.map(segment.doSegment(msg), function(v, k){
					return v.w;
				});
				_.each(kn, function(v, k){
					var queSeg = v.question.split('^');
					var l = _.intersection(msgSeg, queSeg).length;
					if(l / queSeg.length > .4 && l >= sameLength){ //相同的词在整句话中占比大于40%，才能认为找对了
						sameLength = l;
						ans = v.answer;
					}
				});
			}
			$('.chat-items').append('<li class="chat-item"><span class="bubble">' + ans + '</span></li>');
			$('.chat-items-wrp').scrollTop($('.chat-items').height() - $('.chat-items-wrp').height());
		});
	}
});
//定义发消息的键盘事件
$('#msg-box').keydown(function(ev){
	if(ev.keyCode === 13){//enter // && ev.ctrlKey
		ev.preventDefault();
		$('#send-msg').trigger('click');
	}
});
