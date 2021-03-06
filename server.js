var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var session = require('express-session');
var secrets = require('./backend/secrets.js');
var router = require('./backend/routes.js');
var cookieParser = require('cookie-parser');

var app = express();
module.exports.app = app;

app.set('trust proxy', 1);

// Serving static files from main directory.
app.use('/', express.static(__dirname));

//middleware
app.use(cors())

app.use(cookieParser());

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

// Set up backend routes
app.use("/", router);

app.listen(app.get("port"));
console.log("Listening on", app.get("port"));
