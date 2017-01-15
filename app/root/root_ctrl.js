var app = angular.module('app');

app.controller('rootController', function($scope, $rootScope, $window, rootServices, commServices, confirm) {

    var size = 0

    $scope.committees = [];
    _.forEach(commServices, function(committee) {
        $scope.committees.push(committee)
        size++;
    })
    if($window.localStorage["countoncongress-userSignedIn"]){
        $scope.userData = $rootScope.twitterData;
    }

    $scope.loginToTwitter = function() {
        rootServices.loginToTwitter()
            .then(function(response) {
                if (response.data.requestToken) {
                    $window.location.href = 'https://www.twitter.com/oauth/authenticate?oauth_token=' + response.data.requestToken
                } else{
                    services.userData()
                        then(function (twitterData) {
                            console.log("+++ 21 root_ctrl.js twitterData: ", twitterData)
                        })
                }

            })
    }

    $scope.sendTweet = function(message, index){
        rootServices.sendTweet(message)
            .then(function(result) {
                console.log("+++ 35 root_ctrl.js result: ", result)
            })
    }

    $scope.logout = function() {
        console.log("+++ 41 root_ctrl.js Here")
        function onYes() {
            console.log("+++ 41 root_ctrl.js INSIDE")
        }
        confirm.initialize('Are you sure you want to logout?', onYes);
    }
});

