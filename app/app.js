//twitterApp is dependent on the myApp.services module
var cocApp = angular.module('cocApp', [
    'ngRoute',
    'ngSanitize',
    'ngTwitter'
]);

var sharedDirectives = angular.module('sharedDirectives', []);

cocApp.controller('cocAppCtrl', function($scope) {

})

// .config(function($routeProvider) {
//     console.log("+++ 15 app.js Here")
//     // Now set up the states
//     $routeProvider
//         .when('mainIndex', {
//             url: '/',
//             // templateUrl: 'root/index.html',
//             controller: 'rootController',
//             resolve: {
//                 test: function() {
//                     console.log("+++ 24 app.js Here")
//                 }
//             }
//         })
// })