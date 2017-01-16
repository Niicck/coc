var router = require('express').Router();
var path = require('path');

var secrets = require('./secrets.js');

// Twitter integration
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    consumerKey: secrets.consumerKey,
    consumerSecret: secrets.consumerSecret,
    // callback: 'http://localhost:8080/twitterAuthenticated'
        callback: 'http://ec2-35-163-164-176.us-west-2.compute.amazonaws.com:8080/twitterAuthenticated'
        // callback: 'http://countoncongress.org/twitterAuthenticated'
});
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
    if (request.session.twitterData && request.session.twitterData.signedIn) {
        response.redirect('/')
    } else {
        twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
            if (error) {
                console.log("Error getting OAuth request token : " + error);
                request.session.twitterData.signedIn = false;
                response.sendStatus(404)
            } else {
                request.session.twitterRequest = {};
                request.session.twitterData = {};
                request.session.twitterRequest.twitterRequestToken = requestToken;
                request.session.twitterRequest.twitterRequestTokenSecret = requestTokenSecret;
                request.session.twitterData.signedIn = true;
                response.status(200).json({ "requestToken": requestToken, "requestTokenSecret": requestTokenSecret, "results": results })
            }
        });
    }
});
//Route hit when arriving back from Twitter authentication page
router.get('/twitterAuthenticated', function(request, response) {
    twitter.getAccessToken(request.session.twitterRequest.twitterRequestToken, request.session.twitterRequest.twitterRequestTokenSecret, request.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
        if (error) {
            console.log(error);
        } else {
            request.session.twitterAccess = {}
            request.session.twitterAccess.accessToken = accessToken;
            request.session.twitterAccess.accessTokenSecret = accessTokenSecret;
            request.session.twitterData.twitterUsername = results.screen_name;
            response.redirect('/')
        }
    });
});
//Get twitter data for frontend verification
router.get('/twitterdata', function(request, response) {
    response.status(200).send({
        twitterData: request.session.twitterData
    })
});
//Send tweet route
router.post('/sendTweet', function(request, response) {
    twitter.statuses("update", 
        { status: request.body.tweet },
        request.session.twitterAccess.accessToken,
        request.session.twitterAccess.accessTokenSecret,
        function(error, data, res) {
            if (error) {
                response.status(error.statusCode).send(error)
            } else {
                response.status(200).send(data)
            }
        }
    );
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
