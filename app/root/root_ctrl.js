var app = angular.module('app');

app.controller('rootController', function($scope, $window, rootServices, commServices, $rootScope) {

    var size = 0

    $scope.committees = [];
    _.forEach(commServices, function(committee) {
        $scope.committees.push(committee)
        size++;
    })

    $scope.userData = $rootScope.twitterData;
    console.log("+++ 14 root_ctrl.js $scope.userData: ", $scope.userData)

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


    // $scope.$watch('committees', function() {
    //     console.log("+++ 17 root_ctrl.js $scope.committees[0][0].message: ", $scope.committees[0][0].chairman.message)
    // }, true)
});
