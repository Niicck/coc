var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors')
var bodyParser = require('body-parser');
var session = require('express-session');
var keys = require('express-session');
var secrets = require('./backend/secrets.js');
var router = require('./backend/routes.js');

var app = express();
module.exports.app = app;

app.set('trust proxy', 1);

app.use(session({
    secret: secrets.sessionSecret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365
    }
}));

//middleware
app.use(cors())
app.set('port', process.env.PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serving static files from main directory.
app.use('/', express.static(__dirname));
// Set up backend routes
app.use("/", router);

app.listen(app.get("port"));
console.log("Listening on", app.get("port"));
