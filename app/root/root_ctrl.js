var app = angular.module('app');

app.controller('rootController', function($scope, $window, rootServices, commServices, $rootScope) {

    var size = 0

    $scope.committees = [];
    _.forEach(commServices, function(committee) {
        $scope.committees.push(committee)
        size++;
    })

    $scope.userData = $rootScope.twitterData;


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
});
