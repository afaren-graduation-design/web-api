[1mdiff --git a/spec/support/fixture/mongo-tools.js b/spec/support/fixture/mongo-tools.js[m
[1mindex 960a8ab..d4b883c 100644[m
[1m--- a/spec/support/fixture/mongo-tools.js[m
[1m+++ b/spec/support/fixture/mongo-tools.js[m
[36m@@ -43,7 +43,7 @@[m [mfunction refreshMongo(mongoData, callBack) {[m
 [m
 [m
   mongoData.filter((item)=> {[m
[31m-    return item.name !== 'teacher-session';[m
[32m+[m[32m    return item.name == 'paper-definition';[m
   }).forEach((item, key) => {[m
     funList.push(function(data, done) {[m
       var model = fixtureModelMap[this.name];[m
[36m@@ -53,7 +53,10 @@[m [mfunction refreshMongo(mongoData, callBack) {[m
     funList.push(function(data, done) {[m
       var records = this.content;[m
       var model = fixtureModelMap[this.name];[m
[31m-      model.create(records, done);[m
[32m+[m[32m      model.create(records, (err, result) => {[m
[32m+[m[32m        console.log(err);[m
[32m+[m[32m        done(err, result);[m
[32m+[m[32m      });[m
     }.bind(item));[m
   });[m
 [m
