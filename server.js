var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var session = require('express-session');
var secrets = require('./backend/secrets.js');
var router = require('./backend/routes.js');

var app = express();
module.exports.app = app;

app.set('trust proxy', 1);

// Serving static files from main directory.
app.use('/', express.static(__dirname));

//middleware
// app.use(cors())

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Controll-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(session({
    secret: secrets.sessionSecret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365
    }
}));

app.set('port', process.env.PORT || 8080);
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// Set up backend routes
app.use("/", router);

app.listen(app.get("port"));
console.log("Listening on", app.get("port"));
