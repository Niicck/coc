var cocApp = angular.module('cocApp');

cocApp.controller('rootController', function($scope, rootServices) {
    $scope.loginButton = function  () {
        console.log("+++ 5 root_ctrl.js Here")
    }
});
