
/*
 * GET home page.
 */

/*exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/
// exports.index=function(req,res){
	// res.render('index', { title: 'Express' });
// }
module.exports=function(app){
	// var data=['大牛','牛牛','小牛'];
	// app.get('/',function(req,res){
		// res.render('index',{title:data});//模版渲染方法接受两个参数（渲染页面名，渲染参数）
	// })
	// app.get('/kk',function(req,res){
		// res.render('second',{title:data});
	// })
	app.get('/',function(req,res){
		res.render('index',{title:'主页'});
	});
	app.get('/index',function(req,res){
		res.render('index',{title:'主页'});
	});
	app.get('/reg',function(req,res){
		res.render('reg',{title:'注册'});//get协议请求页面
	});
	app.post('/reg',function(req,res){
		//post协议提交注册信息
	});
	app.get('/login',function(req,res){
		res.render('/login',{title:'登陆'});
	});
	app.post('/login',function(req,res){
		
	});
	app.get('/post',function(req,res){
		res.render('/login',{title:'发布'});
	});
	app.post('/post',function(req,res){
		
	});
	app.get('/logout',function(req,res){
		
	});
}
