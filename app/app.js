//twitterApp is dependent on the myApp.services module
var app = angular.module('app', [
    'ui.router',
    'ngLodash'

]);

var sharedDirectives = angular.module('sharedDirectives', []);

app.controller('appCtrl', function($scope, lodash, $rootScope) {
    $rootScope.serverUrl = 'http://localhost:8080'
})

//Main route serving site template
app.config(function($stateProvider, $urlRouterProvider) {
    // Now set up the states
    $stateProvider
        .state('/', {
            url: '/',
            templateUrl: 'app/root/index.html',
            controller: 'rootController',
            resolve: {
                twitterData: function(rootServices, $rootScope, $window) {
                    rootServices.userData()
                        .then(function(result) {
                            $rootScope.twitterData = result.data.twitterData
                            window.localStorage.setItem('countoncongress-username', $rootScope.twitterData.twitterUsername);
                            window.localStorage.setItem('countoncongress-userSignedIn', $rootScope.twitterData.signedIn);
                        })
                }
            }
        })

    $urlRouterProvider.otherwise("/");
})
