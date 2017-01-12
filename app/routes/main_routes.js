cocApp.config(function($routeProvider) {
    $routeProvider

    // Now set up the states
    $routeProvider
        .when('mainIndex', {
            url: '/',
            templateUrl: 'root/index.html',
            controller: 'rootController',
            resolve: {
                test: function() {
                    console.log("+++ 24 app.js Here")
                }
            }
        })
})