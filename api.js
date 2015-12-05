var r = require("./lib/request"),
    request = require("request")
    logger = require("./lib/logger");
var open = require("open");
var mongodb = require('mongodb');
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/pyCloud';
var assert = require('assert');



var mysql = require("mysql");

// First you need to create a connection to the db



var Api = {
  login: function(req, res, cb) {
    var con = mysql.createConnection({
  host: "shorturlinstance.czgmbncumrav.us-west-1.rds.amazonaws.com",
  port:3306,
  user: "shorturl",
  password: "password",
  database: "shorturl"
});


con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
});


var user = {username: req.body.email, password: req.body.password};
console.log(req.body.email);
console.log(req.body.password);
con.query('SELECT * FROM user WHERE username=\''+req.body.email+'\' and password=\''+req.body.password+'\'', function(err,result){
  console.log(result);
  if(err) {res.redirect("/users/login");}
  else {
    if(result!="")
    con.query(
  'UPDATE user SET sid = ? Where username = ? and password=?',
  [req.sessionID, req.body.email,req.body.password],
  function (err, result) {
    if (err) throw err;
    console.log('Changed ' + result.changedRows + ' rows');
    res.redirect("/editor/dashboard");
    con.end(function(err) {
    });
  }
  );
  else res.redirect("/users/login");
  }
  console.log('Last insert ID:', res.insertId);
});




// var postData={
//     ip:req.ip
// };
// request.post({
//     uri:"http://192.168.1.4:3002",
//     headers:{'content-type': 'application/x-www-form-urlencoded'},
//     body:require('querystring').stringify(postData)
//     },function(err,resp,body){
//         var jsonObject = JSON.parse(body);
//         console.log(jsonObject.Location);
//         setTimeout(function() {
//           var loc = jsonObject.Location.trim();
//           res.redirect(""+loc);
//           res.end();
//         }, 5000);   
// });


},

createaccount:function(req,res,cb){
  var con = mysql.createConnection({
  host: "shorturlinstance.czgmbncumrav.us-west-1.rds.amazonaws.com",
  port:3306,
  user: "shorturl",
  password: "password",
  database: "shorturl"
});


con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
});

var user = { username: req.body.email, password: req.body.password,sid:req.sessionID };
con.query('INSERT INTO user SET ?', user, function(err,result){
  if(err) {res.redirect("/users/alreadyexist");}
  else res.redirect("/editor/dashboard");
  console.log('Last insert ID:', res.insertId);
});

con.end(function(err) {
});

}
}

module.exports = Api;