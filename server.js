var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors')
var bodyParser = require('body-parser');
var router = require(__dirname + '/backend/routes.js');


var app = express();

//middleware
app.use(cors())
app.set('port', process.env.PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Use cors
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, makertrails-token');
  next();
});

// Serving static files from main directory.
app.use('/', express.static(__dirname));
// Set up backend routes
app.use("/", router);

app.listen(app.get("port"));
console.log("Listening on", app.get("port"));
