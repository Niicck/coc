var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors')
var bodyParser = require('body-parser');
var session = require('express-session');

// Twitter integration
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    consumerKey: '',
    consumerSecret: '',
    callback: 'http://countoncongress.org'
});

var app = express();
module.exports.app = app;

app.use(session({
 secret: 'kmddlr17',
 resave: true,
 saveUninitialized: false,
 cookie: {maxAge: 10000000*60*60}
}));

//middleware
// app.use(cors())
// app.options('*', cors())
app.set('port', process.env.PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// //Use cors
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, countoncongress');
//     next();
// });


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
    console.log("+++ 53 server.js AT ROUTE")
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
        if (error) {
            console.log("Error getting OAuth request token : " + error);
            response.sendStatus(404)
        } else {
            request.session.twitterRequestToken = requestToken;
            request.session.twitterRequestTokenSecret = requestTokenSecret;
            
            response.json(200, { "requestToken": requestToken,"requestTokenSecret" : requestTokenSecret,"results" : results});
        }
    });
});
