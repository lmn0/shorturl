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
    case "statistics":
      res.status(200).render("statistics/statistics.jade", {
        pageTitle: "ShortURL! - Stats",
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

        console.log("--------------------------------------------------------------------------------------------------------");
//begin 1
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
              con.query("SELECT * FROM clicktrend WHERE surlid ="+inp[1],function(err,resul){
                var data=[];
                data.push(resul[0].jan);
                data.push(resul[0].feb);
                data.push(resul[0].mar);
                data.push(resul[0].apr);
                data.push(resul[0].may);
                data.push(resul[0].jun);
                data.push(resul[0].jul);
                data.push(resul[0].aug);
                data.push(resul[0].sep);
                data.push(resul[0].oct);
                data.push(resul[0].nov);
                data.push(resul[0].dece);
                console.log(data);
          //res.write("jks");
          res.render("editor/statistics.jade", {
            dat:data,
            pageTitle: "ShortURL! - Stats",
            showRegister: true,
            showlogin:false
          });
          res.end();
          con.end(function(err) {
          });
        });
          
      }
    }
  //console.log('Last insert ID:', res.insertId);
});

//end 1
  }
  else if(inp[0] == "2"){

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

        con.query(
  'DELETE FROM shorturl WHERE ID = ?',
  [inp[1]],
  function (err, result) {
    if (err) throw err;
    con.end(function(err) {
          });
    console.log('Deleted ' + result.affectedRows + ' rows');
    res.redirect("/editor/dashboard");
    res.end();
  }
);
        //       con.query("SELECT * FROM clicktrend WHERE surlid ="+inp[1],function(err,resul){
        //         var data=[];
        //         data.push(resul[0].jan);
        //         data.push(resul[0].feb);
        //         data.push(resul[0].mar);
        //         data.push(resul[0].apr);
        //         data.push(resul[0].may);
        //         data.push(resul[0].jun);
        //         data.push(resul[0].jul);
        //         data.push(resul[0].aug);
        //         data.push(resul[0].sep);
        //         data.push(resul[0].oct);
        //         data.push(resul[0].nov);
        //         data.push(resul[0].dece);
        //         console.log(data);
        //   //res.write("jks");
        //   res.render("editor/statistics.jade", {
        //     dat:data,
        //     pageTitle: "ShortURL! - Stats",
        //     showRegister: true,
        //     showlogin:false
        //   });
        //   res.end();
        //   con.end(function(err) {
        //   });
        // });
          
      }
    }
  //console.log('Last insert ID:', res.insertId);
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