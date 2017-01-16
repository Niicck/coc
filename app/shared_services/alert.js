var app = angular.module('app');

app.factory('alert', function() {
    var services = {};
    
    services.alerts = [];

    services.addAlert = function(message, type) {
        services.alerts.push({ 
            message: message,
            type: type
        });
    };

    services.closeAlert = function(index) {
        services.alerts.splice(index, 1);
    };

    return services;
})
