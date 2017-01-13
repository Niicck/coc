var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors')
var bodyParser = require('body-parser');

// Twitter integration
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    
    callback: 'http://countoncongress.org'
});

var app = express();
module.exports.app = app;

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

app.listen(app.get("port"));
console.log("Listening on", app.get("port"));


//Routes
app.get('/', function(request, response) {
    console.log("routes.js - Serve index page")
    response.status(202)
        .sendFile(path.resolve("app/index.html"));
});

// Reroute to app
app.get('/twitterlogin', function(request, response) {
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
        if (error) {
            console.log("Error getting OAuth request token : " + error);
            response.sendStatus(404)
        } else {
            var requestTokenReceived = requestToken;
            console.log("+++ 56 server.js requestTokenReceived: ", requestTokenReceived)
            var tokenSecretReceived = requestTokenSecret;
            console.log("+++ 57 server.js tokenSecretReceived: ", tokenSecretReceived)
            console.log("+++ 54 server.js results: ", results);
            // Store token and tokenSecret somewhere, you'll need them later; redirect user 
            response.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + requestTokenReceived)
        }
    });
});
