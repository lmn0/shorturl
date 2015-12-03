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


//GET Req
router.get(['/', '/:action'], function(req, res, next) {
  var action = req.params.action;

  console.log(req.ip);
  switch(action) {
    case "dashboard":
      break;
    default:
      res.render("pages/home.jade", {
        pageTitle: "ShortURL! - Home",
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
    case "shorten":
      //console.log("shorten");
     
      
      console.log(new Buffer("http://www.hacksparrow.com/base64-encoding-decoding-in-node-js.html").toString('base64'));
      

     break;
  	case "run":
  		res.status(200).json({"status":"Executed"});
  		break;
  }
});
// ====

module.exports = router;