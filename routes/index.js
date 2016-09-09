
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
	Art=require('../models/ArticleMsg.js'),
	User=require('../models/user.js'),
	http = require('http'),
    blogURL = require('url');
module.exports=function(app){
	function crymd5(number) {
		var md5=crypto.createHash('md5');
		var respont=md5.update(number).digest('hex');
		return respont;
	}
	function  checkloginin(req,res,next) {
		if(!req.session.user){
			Error='未登录';
			res.redirect('/');
		}
		next();
	}
	function checkloginout(req,res,next) {
		if (req.session.user){
			Error='已登录';
			res.redirect('back');
		}
		next();
	}
	// var data=['大牛','牛牛','小牛'];
	// app.get('/',function(req,res){
		// res.render('index',{title:data});//模版渲染方法接受两个参数（渲染页面名，渲染参数）
	// })
	// app.get('/kk',function(req,res){
		// res.render('second',{title:data});
	// })
	app.get('/',function(req,res){
         Art.get(function (err,arts) {
			 if (req.session.user){
				 res.render('index',{
					 title:'主页',
					 User:req.session.user,
					 ErrorMsg:Error,
					 Arts:arts
				 });
			 }else {
				 console.log(arts);
				 res.render('index',{
					 title:'主页',
					 User:null,
					 ErrorMsg:Error,
					 Arts:arts
				 });
			 }
		 })


	});
	// app.get('/index',function(req,res){
	// 	res.render('index',{title:'主页'});
	// });
	app.get('/reg',checkloginout);
	app.get('/reg',function(req,res){
			res.render('reg',{
				title:'注册',
				ErrorMsg:Error
			});//get协议请求页面
	});
	app.post('/reg',checkloginout);
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
	app.get('/singin',checkloginout);
	app.get('/singin',function(req,res){
			res.render('singin',{
				title:'登陆',
				ErrorMsg:Error
			});
	});
	app.post('/singin',checkloginout);
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
	app.get('/post',checkloginin);
	app.get('/post',function(req,res){
		res.render('post',{
			title:'发布',
			User:req.session.user,
			ErrorMsg:Error
		});
	});
	app.post('/post',checkloginin);
	app.post('/post',function(req,res){
		var title=req.body.title,
			content=req.body.post,
            uname=req.session.user.name,
			account=req.session.user.account;
        var artcilemsg=new Art({
			useraccount:account,
            username:uname,
			title:title,
			content:content
		});
		artcilemsg.save(function (err,art) {
			if (err){
				Error=err;
				return res.redirect('/');
			}
			req.session.art=art;
			res.redirect('/');
		})
	});
	app.get('/logout',function(req,res){
		Error="";
		req.session.user=null;
		res.redirect('/');
	});
	app.get('/Artdetail',function (req,res) {
		// console.log(req.query.aid);
		var urljson=req.query;
		if (urljson){
			Art.getquery(urljson.aid,function (err,art) {
				res.render('Artdetail',{
					title:'detail',
					Arttitle:art[0].title,
					Artbody:art[0].content,
					nickname:art[0].username,
					posttime:art[0].time.day
				});
			});
		}

	})
	app.post('/Artdetail',function (req,res) {
		
	})
}
