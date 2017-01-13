var app = angular.module('app');

app.factory('rootServices', function($http) {
    var services = {};

    services.loginToTwitter = function () {
        console.log("+++ 7 root_services.js loginToTwitter")
        return $http.get('http://localhost:8080/twitterlogin')
    }

    return services;
  })