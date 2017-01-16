var app = angular.module('app');

app.factory('alert', function() {
    var services = {};
    services.alerts = [];

    services.addAlert = function() {
        services.alerts.push({ msg: 'Another alert!' });
    };

    services.closeAlert = function(index) {
        services.alerts.splice(index, 1);
    };

    return services;
})
