/*
  This module is used for handling Editor related actions
*/

// Node modules
var express = require('express'),
    async = require("async"),
    router = express.Router(),
    Api = require("../../api"),
    r = require("../../lib/request"),
    request=require("request");
var mongodb = require('mongodb');
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/pyCloud';
// ===
var assert = require('assert');

var rpi=[0,0];

var mysql = require("mysql");

// First you need to create a connection to the db




//GET Req
router.get(['/', '/:action'], function(req, res, next) {
  var action = req.params.action;

  console.log(req.ip);
  switch(action) {
    case "dashboard":
    console.log("in dashboard");

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


con.query('SELECT * FROM user WHERE sid=\''+ req.sessionID+'\'', function(err,result){
  
  if(result=="") {res.redirect("/users/login");}
  else 
    {console.log(result[0].ID);
      {

        con.query("SELECT * FROM shorturl WHERE userid ='"+result[0].ID+"'",function(err,result){
          res.status(200).render("editor/dashboard.jade", {
            urls:result,
            pageTitle: "ShortURL! - Dashboard",
            showRegister: true,
            showlogin:false
          });
        });
      }
    }
  //console.log('Last insert ID:', res.insertId);
});



      
      break;
    case "workspacepresent":
      res.status(200).render("editor/workspacepresent.jade", {
        pageTitle: "ShortURL! - Dashboard",
        showRegister: true,
        showlogin:false
      });
      break;
    case "logout":
      res.status(200).render("authentication/alreadyexist.jade", {
        pageTitle: "ShortURL! - Login",
        showRegister: true,
        showlogin:true
      });
      break;
    default:
      res.render("editor/dashboard.jade", {
        pageTitle: "ShortURL! - Dashboard",
        showRegister: false,
        showlogin:false
      });
  }
});
// ===


//POST Req
router.post(['/', '/:action'], function(req, res, next) {
  var action = req.params.action;

  switch(action){
    case "newworkspace":
      
      console.log(req.body.butt);
    
    if(req.body.butt != "create")
    {
      var inp = (req.body.butt).split("+");
      console.log("------------------------------------")
      console.log(inp[1]);
      if(inp[0] == "1"){

        var startcontainer = function(db,rpiurl,userdoc,callback){
      //get the container ID

      //Call kubernetes and start the container
      var postData={
          ip:req.ip
      };
    request.post({
    uri:rpiurl,
    headers:{'content-type': 'application/x-www-form-urlencoded'},
    body:require('querystring').stringify(postData)
    },function(err,resp,body){
      if(!err){
        var jsonObject = JSON.parse(body);
        console.log(jsonObject);
        db.collection('workspace').updateOne({ "uid":userdoc._id,"workspace":inp[1]}, { $set: { "running": true ,"conid":(jsonObject.ConID).trim()}} ,function(err, doc) {
            assert.equal(err, null);
            if (doc != null) {
              console.log(doc);
              //if(doc.status=)
              //startcontainer(db,doc,function(){db.close();});
              setTimeout(function() {
              var loc = jsonObject.Location.trim();
              res.redirect(""+loc);
              res.end();
              }, 5000);
              
            } else {
               console.log(doc);
              res.redirect("/users/login");
            }
        }); 
        
           }
    });
    }

    var resumecontainer = function(db,rpiurl,userdoc,wsdoc,callback){
      //get the container ID

      //Call kubernetes and start the container
      var postData={
          ip:req.ip,
          cid:wsdoc.conid
      };
    request.post({
    uri:rpiurl,
    headers:{'content-type': 'application/x-www-form-urlencoded'},
    body:require('querystring').stringify(postData)
    },function(err,resp,body){
      if(!err){
        var jsonObject = JSON.parse(body);
        console.log(jsonObject);
        db.collection('workspace').updateOne({ "uid":userdoc._id,"workspace":inp[1]}, { $set: { "running": true }} ,function(err, doc) {
            assert.equal(err, null);
            if (doc != null) {
              //console.log(doc);
              //if(doc.status=)
              //startcontainer(db,doc,function(){db.close();});
              setTimeout(function() {
              var loc = jsonObject.Location.trim();
              res.redirect(""+loc);
              res.end();
              }, 5000);
              
            } else {
               console.log(doc);
              res.redirect("/editor/dashboard");
            }
        }); 
        
           }
    });
    }
      
  var findWorkspace=function(db,userdoc,callback){
        var found=0;
        var rpiurl="";
        console.log(userdoc._id);
        var cursor =db.collection('workspace').findOne({ "uid":userdoc._id,"workspace":inp[1],"running":false},function(err, doc) {
            assert.equal(err, null);
            if (doc != null) {
              console.log(doc);
              //if(doc.status=)
              if(doc.conid==""){
                if(doc.storedon==1)
                  rpiurl="http://192.168.10.4:3002/"
                else
                  rpiurl="http://192.168.10.102:3002/"
                startcontainer(db,rpiurl,userdoc,function(){db.close();});
              }
              else{
                if(doc.storedon==1)
                  rpiurl="http://192.168.10.4:3002/resume"
                else
                  rpiurl="http://192.168.10.102:3002/resume"
                resumecontainer(db,rpiurl,userdoc,doc,function(){db.close();});
              }

            } else {
               console.log(doc);
              res.redirect("/editor/dashboard");
            }
        }); 
      } 

   var findUser = function(db, callback) {
          var found=0;
    console.log(req.sessionID);
   var cursor =db.collection('users').findOne( { "sid":req.sessionID} ,function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
        console.log(doc);
         findWorkspace(db,doc,function(){db.close();});
      } else {
        console.log("user not logged in");
        res.redirect("/users/login");
        res.end();
      }
      //res.redirect('dashboard');
   });
   
};

        MongoClient.connect(url, function (err, db) {
        if (err) {
          console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
    //HURRAY!! We are connected. 
          console.log('Connection established to', url);

    // Get the documents collection
    
          findUser(db,function(){db.close();});
        
        }
      });

  }
  else if(inp[0] == "2"){

        var stopcontainer = function(db,rpiurl,userdoc,wsdoc,callback){
      //get the container ID

      //Call kubernetes and start the container
      var postData={
          cid:wsdoc.conid
      };
    request.post({
    uri:rpiurl,
    headers:{'content-type': 'application/x-www-form-urlencoded'},
    body:require('querystring').stringify(postData)
    },function(err,resp,body){
      if(!err){
        var jsonObject = JSON.parse(body);
        console.log(jsonObject);
        if(jsonObject.status=="stopped")
        db.collection('workspace').updateOne({ "uid":userdoc._id,"workspace":inp[1]}, { $set: { "running": false}} ,function(err, doc) {
            assert.equal(err, null);
            if (doc != null) {
              console.log(doc);
              //if(doc.status=)
              //startcontainer(db,doc,function(){db.close();});
              
                res.redirect('/editor/dashboard');
                res.end();
             
            } else {
               console.log(doc);
              res.redirect("/editor/dashboard");
            }
        }); 
        
           }
    });
    }
      
  var findWorkspace=function(db,userdoc,callback){
        var found=0;
        var rpiurl="";
        console.log(userdoc._id);
        var cursor =db.collection('workspace').findOne({ "uid":userdoc._id,"workspace":inp[1],"running":true},function(err, doc) {
            assert.equal(err, null);
            if (doc != null) {
              console.log(doc);
              //if(doc.status=)

              if(doc.storedon==1)
                rpiurl ="http://192.168.10.4:3002/stop"
              else
                rpiurl="http://192.168.10.102:3002/stop"

                stopcontainer(db,rpiurl,userdoc,doc,function(){db.close();});


            } else {
               console.log(doc);
              res.redirect("/editor/dashboard");
            }
        }); 
      } 

   var findUser = function(db, callback) {
          var found=0;
    console.log(req.sessionID);
   var cursor =db.collection('users').findOne({ "sid":req.sessionID} ,function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
        console.log(doc);
         findWorkspace(db,doc,function(){db.close();});
      } else {
        console.log("user not logged in");
        res.redirect("/users/login");
        res.end();
      }
      //res.redirect('dashboard');
   });
   
};

        MongoClient.connect(url, function (err, db) {
        if (err) {
          console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
    //HURRAY!! We are connected. :)
          console.log('Connection established to', url);

    // Get the documents collection
    
          findUser(db,function(){db.close();});
        
        }
      });

  }
  else if(inp[0] == "3"){


        var deletecontainer = function(db,rpiurl,userdoc,wsdoc,callback){
      //get the container ID

      //Call kubernetes and start the container
      var postData={
          cid:wsdoc.conid
      };
    request.post({
    uri:rpiurl,
    headers:{'content-type': 'application/x-www-form-urlencoded'},
    body:require('querystring').stringify(postData)
    },function(err,resp,body){
      if(!err){
        var jsonObject = JSON.parse(body);
        console.log(jsonObject);
        if(jsonObject.status=="deleted")
        db.collection('workspace').deleteOne({ "uid":userdoc._id,"workspace":inp[1]},function(err, doc) {
            assert.equal(err, null);
            if (doc != null) {
              //console.log(doc);
              //if(doc.status=)
              //startcontainer(db,doc,function(){db.close();});
              
                res.redirect('/editor/dashboard');
                res.end();
             
            } else {
               console.log(doc);
              res.redirect("/editor/dashboard");
            }
        }); 
        
           }
    });
    }
      
  var findWorkspace=function(db,userdoc,callback){
        var found=0;
        var rpiurl="";
        console.log(userdoc._id);
        var cursor =db.collection('workspace').findOne({ "uid":userdoc._id,"workspace":inp[1],"running":true},function(err, doc) {
            assert.equal(err, null);
            if (doc != null) {
              console.log(doc);
              //if(doc.status=)
              if(doc.storedon==1)
                rpiurl ="http://192.168.10.4:3002/delete"
              else
                rpiurl="http://192.168.10.102:3002/delete"
              deletecontainer(db,rpiurl,userdoc,doc,function(){db.close();});


            } else {
               console.log(doc);
              res.redirect("/editor/dashboard");
            }
        }); 
      } 

   var findUser = function(db, callback) {
          var found=0;
    console.log(req.sessionID);
   var cursor =db.collection('users').findOne( { "sid":req.sessionID} ,function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
        console.log(doc);
         findWorkspace(db,doc,function(){db.close();});
      } else {
        console.log("user not logged in");
        res.redirect("/users/login");
        res.end();
      }
      //res.redirect('dashboard');
   });
   
};

        MongoClient.connect(url, function (err, db) {
        if (err) {
          console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
    //HURRAY!! We are connected. :)
          console.log('Connection established to', url);

    // Get the documents collection
    
          findUser(db,function(){db.close();});
        
        }
      });

  }else if(inp[0] == "4"){
    var opencontainer = function(db,rpiurl,userdoc,wsdoc,callback){
      //get the container ID

      //Call kubernetes and start the container
      var postData={
          ip:req.ip,
          cid:wsdoc.conid
      };
    request.post({
    uri:rpiurl,
    headers:{'content-type': 'application/x-www-form-urlencoded'},
    body:require('querystring').stringify(postData)
    },function(err,resp,body){
      if(!err){
        var jsonObject = JSON.parse(body);
        console.log(jsonObject);
        db.collection('workspace').updateOne({ "uid":userdoc._id,"workspace":inp[1]}, { $set: { "running": true }} ,function(err, doc) {
            assert.equal(err, null);
            if (doc != null) {
              //console.log(doc);
              //if(doc.status=)
              //startcontainer(db,doc,function(){db.close();});
              setTimeout(function() {
              var loc = jsonObject.Location.trim();
              res.redirect(""+loc);
              res.end();
              }, 5000);
              
            } else {
               console.log(doc);
              res.redirect("/editor/dashboard");
            }
        }); 
        
           }
    });
    }
      
  var findWorkspace=function(db,userdoc,callback){
        var found=0;
        var rpiurl="";
        console.log(userdoc._id);
        var cursor =db.collection('workspace').findOne({ "uid":userdoc._id,"workspace":inp[1],"running":true},function(err, doc) {
            assert.equal(err, null);
            if (doc != null) {
              console.log(doc);
              //if(doc.status=)
              
                if(doc.storedon==1)
                  rpiurl="http://192.168.10.4:3002/open"
                else
                  rpiurl="http://192.168.10.102:3002/open"
                opencontainer(db,rpiurl,userdoc,doc,function(){db.close();});
            } else {
               console.log(doc);
              res.redirect("/editor/dashboard");
            }
        }); 
      } 

   var findUser = function(db, callback) {
          var found=0;
    console.log(req.sessionID);
   var cursor =db.collection('users').findOne( { "sid":req.sessionID} ,function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
        console.log(doc);
         findWorkspace(db,doc,function(){db.close();});
      } else {
        console.log("user not logged in");
        res.redirect("/users/login");
        res.end();
      }
      //res.redirect('dashboard');
   });
   
};

        MongoClient.connect(url, function (err, db) {
        if (err) {
          console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
    //HURRAY!! We are connected. :)
          console.log('Connection established to', url);

    // Get the documents collection
    
          findUser(db,function(){db.close();});
        
        }
      });
  }


    }else if(req.body.workspacename=="" || req.body.descrip=="")
    {
      res.redirect("/editor/dashboard");
      res.end();
    }else{

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


con.query('SELECT * FROM user WHERE sid=\''+ req.sessionID+'\'', function(err,result){
  
  if(result=="") {res.redirect("/users/login");}
  else 
    {console.log(result[0].ID);
      {

         var postData={
          userid:result[0].ID,
          urlname:req.body.urlname,
          url:req.body.bigurl
          };
    request.post({
    uri:"http://cpbal-149790031.us-west-1.elb.amazonaws.com:80/makeshort",
    headers:{'content-type': 'application/x-www-form-urlencoded'},
    body:require('querystring').stringify(postData)
    },function(err,resp,body){

        if(err==null){
          console.log(resp);
          var jsonObject = JSON.parse(body);
          console.log(jsonObject);
           if(jsonObject.status==true)
           {
              con.query("SELECT * FROM shorturl WHERE userid ='"+result[0].ID+"'",function(err,result){

          res.status(200).render("editor/dashboard.jade", {
            urls:result,
            pageTitle: "ShortURL! - Dashboard",
            showRegister: true,
            showlogin:false
          });
        });
           }
        }
    });

        
      }
    }
  //console.log('Last insert ID:', res.insertId);
});

      }

      break;

  	case "run":
  		res.status(200).json({"status":"Executed"});
  		break;
  }
});
// ====

module.exports = router;