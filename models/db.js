//MongoDB连接配置
var settings=require('../settings'),
    db=require('mongodb').Db,
    Connection=require('mongodb').Connection,
    Server=require('mongodb').Server;
module.exports=new db(settings.db,new Server(settings.host,settings.port),{safe:true});//创建一个数据库连接实例，通过module.exports导出该实例