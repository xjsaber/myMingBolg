var DB=require('./db');
var ObjectID = require('mongodb').ObjectID;
var markdown=require('markdown').markdown;
// var markdown = require('markdown-js');
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题
                    var reg= new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}
function article(articlemodel) {
    this.articposter=articlemodel.useraccount;
    this.articpostername=articlemodel.username;
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
        username:this.articpostername,
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
                arts.forEach(function (art) {
                    if(art){
                        art.content=markdown.toHTML(art.content);
                    }

                })
                callback(null,arts);
            })
        })
    })
}
//按条件查询
article.getquery=function (aid,callback) {
    DB.open(function (err,mongo) {
        if (err){
          return  callback(err);
        }
        mongo.collection('Act',function (err,collection) {
            if (err){
                DB.close();
                return callback(err);
            }
            // var query="{_id:ObjectId('{0}')}";
            // if (aid){
            //     query=query.format(aid);
            //     console.log(query);
            // }
            collection.find({_id:ObjectID(aid)}).sort({time:-1}).toArray(function (err,docs) {
                DB.close();
                if (err){
                    return callback(err);
                }
                console.log(docs);
                docs.forEach(function (doc) {
                    if (doc){
                        doc.content=markdown.toHTML(doc.content);
                    }
                });
                callback(null,docs);
            })
        })
    })
}
