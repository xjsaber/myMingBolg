
/*
 * GET home page.
 */

/*exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/
// exports.index=function(req,res){
	// res.render('index', { title: 'Express' });
// }
var crypto=require('crypto'),//加载加密模块
	Error='',
	User=require('../models/user.js');
module.exports=function(app){
	function crymd5(number) {
		var md5=crypto.createHash('md5');
		var respont=md5.update(number).digest('hex');
		return respont;
	}
	// var data=['大牛','牛牛','小牛'];
	// app.get('/',function(req,res){
		// res.render('index',{title:data});//模版渲染方法接受两个参数（渲染页面名，渲染参数）
	// })
	// app.get('/kk',function(req,res){
		// res.render('second',{title:data});
	// })
	app.get('/',function(req,res){
		if (req.session.user){
			res.render('index',{
				title:'主页',
				User:req.session.user
			});
		}

	});
	// app.get('/index',function(req,res){
	// 	res.render('index',{title:'主页'});
	// });
	app.get('/reg',function(req,res){
		if (req.flash('error')){
			res.render('reg',{
				title:'注册',
				ErrorMsg:req.flash('error').toString()
			});//get协议请求页面
		}
	});
	app.post('/reg',function(req,res){
		//post协议提交注册信息
		var uname=req.body.usernickname,
			uaccount=req.body.useraccount,
			upwd=req.body.userpassword,
			upwdrepeat=req.body.userpasswordagain,
			umail=req.body.useremail;
		if (upwd!=upwdrepeat){
			req.flash('error','两次输入密码不一致');
			return res.redirect('/reg');
		};
		//为密码生成md5值
		// var md5=crypto.createHash('md5');
		// var userpassword=md5.update(upwd).digest('hex');
		var userpassword=crymd5(upwd);
		var usermessage=new User({
			name:uname,
			account:uaccount,
			password:userpassword,
			email:umail
		});
		User.get(usermessage.name,function (err,user) {
			if (user){
				req.flash('error','用户名已存在');
				return res.redirect('/reg');
			}
			usermessage.save(function (err,user) {
				if(err){
					req.flash('err');
					return res.redirect('/reg');
				};
				req.session.user=user;//将用户信息存入session
				req.flash('Success','注册成功');
				res.redirect('/');
			})
		})
	});
	app.get('/singin',function(req,res){
			res.render('singin',{
				title:'登陆',
				ErrorMsg:Error
			});
	});
	app.post('/singin',function(req,res){
        var currentacc=req.body.loginacc,
			currentpwd=req.body.loginpwd;
		var  crypwd=crymd5(currentpwd);
		User.loginget(currentacc,function (err,user) {
			if (user==null){
				res.redirect('/singin');
				Error='账号不正确';
				// req.flash("error","账号不正确");
				return ;
			};
			if (user["password"]!=crypwd){
				res.redirect('/singin');
				Error='密码不正确';
				// req.flash("error","密码不正确");
				return ;
			};
			req.session.user=user;
			// res.render('index',{Usermessage:"123"});
			// console.log(user.name);
			res.redirect('/');
		})
	});
	app.get('/post',function(req,res){
		res.render('post',{title:'发布'});
	});
	app.post('/post',function(req,res){
		
	});
	app.get('/logout',function(req,res){
		
	});
}
