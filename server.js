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
    callback: 'http://localhost:8080/twitterAuthenticated'
        // callback: 'http://countoncongress.org'
});

var app = express();
module.exports.app = app;

app.use(session({
    secret: 'kmddlr17',
    resave: true,
    saveUninitialized: false,
}));

//middleware
app.use(cors())
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
    if (request.session.twitterData && request.session.twitterData.signedIn) {
        console.log("server.js - Serve index page - User Signed in")
        console.log("+++ 54 server.js request.session.twitterData: ", request.session.twitterData)
        twitter.verifyCredentials(request.session.twitterData.accessToken, request.session.twitterData.accessTokenSecret, function(error, data, res) {
            if (error) {
                console.log("+++ 56 server.js error: ", error)
            } else {
                    response.status(202)
                        .sendFile(path.resolve("app/index.html"));
            };
        })
    } else {
        console.log("server.js - Serve index page - User NOT SIGNED IN")
        request.session.twitterData = {};
        request.session.twitterData.signedIn = false;
        response.status(202)
            .sendFile(path.resolve("app/index.html"));
    }
});

// Reroute to app
app.get('/twitterlogin', function(request, response) {
    console.log("+++ 76 server.js request.session.twitterData.signedIn: ", request.session.twitterData.signedIn)
    if (request.session.twitterData.signedIn) {
        response.redirect('/')
    } else {
        twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
            if (error) {
                console.log("Error getting OAuth request token : " + error);
                request.session.twitterData.signedIn = false;
                response.sendStatus(404)
            } else {
                request.session.twitterData.twitterRequestToken = requestToken;
                request.session.twitterData.twitterRequestTokenSecret = requestTokenSecret;
                request.session.twitterData.signedIn = true;
                response.status(200).json({ "requestToken": requestToken, "requestTokenSecret": requestTokenSecret, "results": results })
            }
        });
    }
});

app.get('/twitterAuthenticated', function(request, response) {
    twitter.getAccessToken(request.session.twitterData.twitterRequestToken, request.session.twitterData.twitterRequestTokenSecret, request.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
        if (error) {
            console.log(error);
        } else {
            request.session.twitterData.accessToken = accessToken;
            request.session.twitterData.accessTokenSecret = accessTokenSecret;
            request.session.twitterData.twitterUsername = results.screen_name;
            console.log("+++ 82 server.js results: ", results)
            response.redirect('/')
        }
    });
});

app.get('/twitterdata', function(request, response) {
        response.status(200).send({
            twitterData: request.session.twitterData
        })
})
