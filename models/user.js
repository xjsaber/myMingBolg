var db=require('./db');
function User(user) {
    this.nickname=user.name;
    this.acount=user.account;
    this.password=user.password;
    this.email=user.email;
}
module.exports=User;

//存储用户信息
User.prototype.save=function (callback) {
    //存入数据库文档对象
    var user={
        name:this.nickname,
        account:this.acount,
        password:this.password,
        email:this.email
    };

    //开启mongodb
    db.open(function (err,mongodb) {
        if(err){
            return callback(err);//返回错误信息
        };
        //读取users集合
        db.collection('user',function (err,collection) {
            if(err){
                db.close();
                return callback(err);
            };
            //将用户信息插入users集合
            collection.insert(user,{safe:true},function (err,user) {
                db.close();
                if (err){
                    return callback(err);
                }
                callback(null,user[0]);
            });
        })
    });
};

//获取用户信息
User.get=function (currntaccount,callback) {
    //open数据库
    db.open(function (err,mongodb) {
        if (err){
            db.close();
           return callback(err);
        };
        mongodb.collection('users',function (err,collection) {
            if (err){
                db.close();
                return callback(err);
            };
            //查找账号
            collection.findOne({name:currntaccount},function (err,user) {
                if (err){
                    db.close();
                    return callback(err);
                };
                db.close();
                callback(null,user);
            })
        })
    })
}

User.loginget=function (currntaccount,callback) {
    //open数据库
    db.open(function (err,mongodb) {
        if (err){
            db.close();
            return callback(err);
        };
        mongodb.collection('user',function (err,collection) {
            if (err){
                db.close();
                return callback(err);
            };
            //查找账号
            collection.findOne({account:currntaccount},function (err,user) {
                if (err){
                    db.close();
                    return callback(err);
                };
                db.close();
                callback(null,user);
            })
        })
    })
}