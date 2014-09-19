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
	mongoose = require('mongoose');
	_ = require('underscore');

mongoose.connect('mongodb://localhost/haimianbaobao');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('mongodb连接成功');
});
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

//关闭启动画面
setTimeout(function(){
	$('.wecome-wrp').fadeOut();
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

//保存输入的条目
$('body').on('click', '.save-study', function(){
	var Knowledge = mongoose.model('Knowledge');
	$('.study-group').each(function(k, v){
		var _qItem = $(v).find('.study-question'),
			_q = _qItem.val(),
			_aItem = $(v).find('.study-answer'),
			_a = _aItem.val();
		if(!!_q){
			var knowledge = new Knowledge({'question': _q, 'answer': _a});
			knowledge.save();
			_qItem.val('');
			_aItem.val('');
		}
	});
});


