var router = require('express').Router();
var path = require('path');

router.get('/', function(request, response) {
    console.log("routes.js Serve index page")
    response.status(202)
        .sendFile(path.resolve("app/index.html"));
});

module.exports = router;
