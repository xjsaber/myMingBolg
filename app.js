
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var MongoStore=require('connect-mongo')(express);//会话中间件
var setting=require('./settings');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);//设置监听端口
app.set('views', path.join(__dirname, 'views'));//设置视图模板路径
app.set('view engine', 'ejs');//设置使用模板引擎如：jade等
app.use(express.favicon());//使用框架中间件
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());//使用cookie解析中间件
app.use(express.session({
    secret:setting.cookieSecret,
    key:setting.db,//cookie name
    cookie:{maxAge:1000*60*60*24*30},//设置过期时间30天
    store:new MongoStore({
     /*   db:setting.db,
        host:setting.host,
        port:setting.port*/
        url: 'mongodb://localhost/blog'
    })
}));//express.session()提供会话支持，secret防止篡改cookie，key是cookie的名字，设置cookie的maxAge的值来设定cookie的生存期，设置store是存储方式，本人参数设置为MongoStore实例把会话存储到数据库中
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));//设置静态文件路径（css等）

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
routes(app);
//routes.second;
/*app.get('/',function(req,res){
	res.render('index',{title:'学习路由'});
});*/

// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
