var app = angular.module('app');

app.factory('rootServices', function($http) {
    var services = {};

    services.loginToTwitter = function () {
        // $http.get('localhost:8080/twitterlogin')
    }

    return services;
  })