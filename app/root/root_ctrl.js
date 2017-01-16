var app = angular.module('app');

app.controller('rootController', function($scope, $rootScope, $window, rootServices, commServices) {

    $scope.committees = [];
    _.forEach(commServices, function(committee) {
        $scope.committees.push(committee)
    })
    if ($window.localStorage["countoncongress-userSignedIn"]) {
        $scope.userData = $rootScope.twitterData;
    }
    console.log("+++ 12 root_ctrl.js $scope.userData: ", $scope.userData)

    var getTwitterData = function () {
        console.log("+++ 15 root_ctrl.js Getting Twitter Data")
        rootServices.userData()
            .then(function(twitterData) {
                console.log("+++ 18 root_ctrl.js twitterData: ", twitterData)
                $rootScope.twitterData = twitterData.data.twitterData;
                console.log("+++ 20 root_ctrl.js $rootScope.twitterData: ", $rootScope.twitterData)
                console.log("+++ 21 root_ctrl.js $scope.userData: ", $scope.userData)
            })
    }

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

    $scope.sendTweet = function(message, name, committeeIndex, memberIndex) {
        rootServices.sendTweet(message)
            .then(function(result) {
                $scope.committees[committeeIndex][memberIndex].chairman.message = $scope.committees[committeeIndex][memberIndex].chairman.twitterHandle + " ";
                $scope.alert.addAlert('Tweet Sent to ' + name, 'success');
            })
            .catch(function(result) {
                var response = JSON.parse(result.data.data)
                $scope.alert.addAlert(response.errors[0].message, 'danger');
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

    getTwitterData();
});
