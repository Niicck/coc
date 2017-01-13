var app = angular.module('app');

app.controller('rootController', function($scope, $timeout, rootServices, commServices) {

    var size = 0

    $scope.committees = [];
    _.forEach(commServices, function (committee) {
        $scope.committees.push(committee)
        size++;
    })

    console.log("+++ 13 root_ctrl.js size: ", size)


    $scope.$watch('committees', function () {
        console.log("+++ 17 root_ctrl.js $scope.committees[0][0].message: ", $scope.committees[0][0].chairman.message)
    }, true)
});
