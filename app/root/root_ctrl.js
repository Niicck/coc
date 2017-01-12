var app = angular.module('app');

app.controller('rootController', function($scope, $timeout, rootServices) {

    var size = 0

    $scope.committees = [];
    _.forEach(rootServices, function (committee) {
        $scope.committees.push(committee)
        size++;
    })

    console.log("+++ 13 root_ctrl.js size: ", size)

});
