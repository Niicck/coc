var router = require('express').Router();
var path = require('path');

var secrets = require('./secrets.js');
// Twitter integration
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    consumerKey: secrets.consumerKey,
    consumerSecret: secrets.consumerSecret,
    // callback: 'http://localhost:8080/twitterAuthenticated'
    // callback: 'http://ec2-52-10-24-27.us-west-2.compute.amazonaws.com:8080/twitterAuthenticated'
    callback: secrets.address + '/twitterAuthenticated'
});

console.log("+++ 15 routes.js twitter.callback: ", twitter.callback)
//Routes
//Home route
router.get('/', function(request, response) {
    if (request.session.twitterData && request.session.twitterData.signedIn) {
        console.log("server.js - Serve index page - User Signed in")
        twitter.verifyCredentials(request.session.twitterAccess.accessToken, request.session.twitterAccess.accessTokenSecret, function(error, data, res) {
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
//login to Twitter route
router.get('/twitterlogin', function(request, response) {
    console.log("+++ 38 routes.js at /twitterlogin")
    if (request.session.twitterData && request.session.twitterData.signedIn) {
        console.log("+++ 40 routes.js twitter data present already, redirect to /")
        response.redirect('/')
    } else {
        twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
            if (error) {
                console.log("Error getting OAuth request token : " + error);
                request.session.twitterData.signedIn = false;
                response.sendStatus(404)
            } else {
                console.log("+++ 49 routes.js /twitterlogin success")
                request.session.twitterRequest = {};
                request.session.twitterData = {};
                request.session.twitterRequest.twitterRequestToken = requestToken;
                request.session.twitterRequest.twitterRequestTokenSecret = requestTokenSecret;
                request.session.twitterData.signedIn = true;
                request.session.save();
                console.log("+++ 56 routes.js request.session: ", request.session)
                response.status(200).json({ "requestToken": requestToken, "requestTokenSecret": requestTokenSecret, "results": results })
            }
        });
    }
});
//Route hit when arriving back from Twitter authentication page
router.get('/twitterAuthenticated', function(request, response) {
    console.log("+++ 64 routes.j4 at /twitterAuthenticated")
    console.log("+++ 65 routes.js request: ", request)
    console.log("+++ 66 routes.j6 request: ", request.session)
    twitter.getAccessToken(request.session.twitterRequest.twitterRequestToken, request.session.twitterRequest.twitterRequestTokenSecret, request.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
        if (error) {
            console.log(error);
        } else {
            console.log("+++ 67 routes.js Success at /twitterAuthenticated. Redirect to /")
            request.session.twitterAccess = {}
            request.session.twitterAccess.accessToken = accessToken;
            request.session.twitterAccess.accessTokenSecret = accessTokenSecret;
            request.session.twitterData.twitterUsername = results.screen_name;
            request.session.twitterData.userId = results.user_id;
            console.log("+++ 72 routes.js results: ", results)
            response.redirect('/')
        }
    })
});
//Get twitter data for frontend verification
router.get('/twitterdata', function(request, response) {
    console.log("+++ 78 routes.js /twitterdata")
    console.log("+++ 79 routes.js request.session.twitterData: ", request.session.twitterData)
    response.status(200).send({
        twitterData: request.session.twitterData
    })
});
//Send tweet route
router.post('/sendTweet', function(request, response) {
    console.log("+++ 85 routes.js /sendTweet")
    twitter.statuses("update", { status: request.body.tweet },
        request.session.twitterAccess.accessToken,
        request.session.twitterAccess.accessTokenSecret,
        function(error, data, res) {
            if (error) {
                response.status(error.statusCode).send(error)
            } else {
                response.status(200).send(data)
            }
        }
    )
});
//Logout from our app. App still has access in the user's twitter apps, but our sessions is destroyed.
router.get('/logout', function(request, response) {
    request.session.destroy();
    if (!request.session) {
        console.log("Logged out")
        response.sendStatus(200)
    } else {
        console.log("Not logged out")
        response.sendStatus(400)
    };

})

module.exports = router;
