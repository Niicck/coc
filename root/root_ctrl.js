var cocApp = angular.module('cocApp');

cocApp.controller('rootController', function($scope) {
    $scope.clickButton = function  () {
      console.log("+++ 4 controllers.js Here")
    }
});
