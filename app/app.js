//twitterApp is dependent on the myApp.services module
var app = angular.module('app', [
    'ui.router',
    'ngLodash'

]);

var sharedDirectives = angular.module('sharedDirectives', []);

app.controller('appCtrl', function($scope, lodash) {

})

//Main route serving site template
app.config(function($stateProvider, $urlRouterProvider) {
    // Now set up the states
    $stateProvider
        .state('/', {
            url: '/',
            templateUrl: 'app/root/index.html',
            controller: 'rootController'
        })

    $urlRouterProvider.otherwise("/");
})