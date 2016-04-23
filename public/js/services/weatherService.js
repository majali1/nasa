'use strict'

angular.module('nasaApp')
    .factory('weatherService', ['$rootScope', 'util',
        function($rootScope, util){
            var service = {};

            service.getCountryWeatherData = function(lat, lon){
              util.HttpRequest.Get({url: "http://api.openweathermap.org/data/2.5/weather?lat={latVal}&lon={lonVal}&APPID={weatherKey}".format({latVal: lat, lonVal: lon, weatherKey: openWeatherKey}), data: {}}, function(response){
                console.log(response);
              });
            };

            return service;
        }]);