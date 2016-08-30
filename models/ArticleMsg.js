var DB=require('./db');
function article(articlemodel) {
    this.articposter=articlemodel.useraccount;
    this.artictitle=articlemodel.title;
    this.articcontent=articlemodel.content;
}
module.exports=article;
//存储文章对象信息
article.prototype.save=function (callback) {
    var date = new Date();
    //存储各种时间格式，方便以后扩展
    var time = {
        date: date,
        year : date.getFullYear(),
        month : date.getFullYear() + "-" + (date.getMonth() + 1),
        day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    }
    //声明存储对象数据
    var  art={
        poster:this.articposter,
        title:this.artictitle,
        content:this.articcontent,
        time:time
    };
    //打开数据库连接
    DB.open(function (err,mongo) {
        if (err){
            return callback(err);
        }
        mongo.collection('Act',function (err,collection) {
            if(err){
                DB.close();
                return callback(err);
            }
            collection.insert(art,{safe:true},function (err,art) {
                DB.close();
                if (err){
                    return callback(err);
                }
                callback(null,art[0]);
            })
        })
    })
}

//读取所有文章信息
article.get=function (callback) {
    DB.open(function (err,mongo) {
        if (err){
            return callback(err);
        }
        mongo.collection('Act',function (err,collection) {
            if (err){
                DB.close();
                callback(err);
            }
            // collection.find({},function (err,arts) {
            //     if (err){
            //         DB.close();
            //         callback(err);
            //     }
            //     callback(null,arts);
            // })
            collection.find().toArray(function (err,arts) {
                DB.close();
                if (err){
                    callback(err);
                }
                callback(null,arts);
            })
        })
    })
}
