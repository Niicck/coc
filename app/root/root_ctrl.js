var app = angular.module('app');

app.controller('rootController', function($scope, $rootScope, $window, rootServices, commServices) {

    $scope.committees = [];
    _.forEach(commServices, function(committee) {
        $scope.committees.push(committee)
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
                        .then(function (twitterData) {
                            $rootScope.twitterData = twitterData.data.twitterData;
                        })
                }

            })
    }

    $scope.sendTweet = function(message, name, committeeIndex, memberIndex){
             
        rootServices.sendTweet(message)
            .then(function(result) {
                if(result.status === 200){
                    $scope.committees[committeeIndex][memberIndex].chairman.message = $scope.committees[committeeIndex][memberIndex].chairman.twitterHandle + " ";
                    $scope.alert.addAlert('Tweet Sent to ' + name, 'success');
                } else{
                  console.log("+++ 35 root_ctrl.js ERROR")
                  $scope.alert.addAlert('Something went wrong with Twitter', 'danger');
                };
            })
    }


    $scope.test = function(index) {
        // $scope.alert.addAlert('Something went wrong with Twitter', 'danger');
        $scope.alert.addAlert('Tweet Sent', 'success');
    }

    $scope.logout = function() {
        function onYes() {
            rootServices.logout()
                .then(function(result) {
                    if(result.status){
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
});

