//twitterApp is dependent on the myApp.services module
var app = angular.module('app', [
    'ui.router',
    'ngLodash',
    'ngAnimate',
    'ngTouch',
    'ui.bootstrap'
]);

var sharedDirectives = angular.module('sharedDirectives', []);

app.controller('appCtrl', function($scope, $rootScope, $window, lodash, alert, confirm, rootServices) {
    $rootScope.serverUrl = 'http://localhost:8080';
    // $rootScope.serverUrl = 'http://ec2-52-10-24-27.us-west-2.compute.amazonaws.com:8080';
    // $rootScope.serverUrl = 'http://www.reachthehill.org';

    $scope.alert = alert;

    $scope.confirm = confirm;
    $scope.currentYear = moment().format('YYYY');


    $scope.loginToTwitter = function() {
        rootServices.loginToTwitter()
            .then(function(response) {
                if (response.data.requestToken) {
                    $window.location.href = 'https://www.twitter.com/oauth/authenticate?oauth_token=' + response.data.requestToken
                } else {
                    getTwitterData();
                }
            })
    }

    $scope.logout = function() {
        function onYes() {
            rootServices.logout()
                .then(function(result) {
                    if (result.status) {
                        delete $rootScope.twitterData;
                        $scope.userData = {};
                        $scope.userData.signedIn = false;
                        window.localStorage.setItem('countoncongress-username', null);
                        window.localStorage.setItem('countoncongress-userSignedIn', false);
                    }
                })
        }
        $scope.confirm.initialize('Are you sure you want to logout?', onYes);
    }
})

var getTwitterData = function() {
    rootServices.userData()
        .then(function(twitterData) {
            $rootScope.userData = twitterData.data.twitterData;
        })
}

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
                            if(result.data.twitterData){
                                $rootScope.twitterData = result.data.twitterData;
                                window.localStorage.setItem('countoncongress-username', $rootScope.twitterData.twitterUsername);
                                window.localStorage.setItem('countoncongress-userSignedIn', $rootScope.twitterData.signedIn);
                            }else{
                                window.localStorage.setItem('countoncongress-username', null);
                                window.localStorage.setItem('countoncongress-userSignedIn', false);
                            }
                        })
                }
            }
        })

    $urlRouterProvider.otherwise("/");
})
