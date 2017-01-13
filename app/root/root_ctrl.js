var app = angular.module('app');

app.controller('rootController', function($scope, $timeout, rootServices, commServices, $window) {

    var size = 0

    $scope.committees = [];
    _.forEach(commServices, function(committee) {
        $scope.committees.push(committee)
        size++;
    })

    console.log("+++ 13 root_ctrl.js size: ", size)

    $scope.loginToTwitter = function() {
        rootServices.loginToTwitter()
            .then(function(data) {
                if (data) {
                    $window.location.href = 'https://www.twitter.com/oauth/authenticate?oauth_token=' + data.data.requestToken

                }

            })
    }

    $scope.$watch('committees', function() {
        console.log("+++ 17 root_ctrl.js $scope.committees[0][0].message: ", $scope.committees[0][0].chairman.message)
    }, true)
});
