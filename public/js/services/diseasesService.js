'use strict'

angular.module('nasaApp')
    .factory('diseaseService', ['$rootScope', 'util',
        function($rootScope, util){
            var service = {};

            service.getDiseaseByName = function(diseaseName){
                /*util.HttpRequest.Get({url: 'http://t.cdc.gov/feed.aspx?cid=Flu'.format({diseaseName : diseaseName, cdcKey: cdcKey}), data: {}}, function(response){
                   console.log(response);
                });*/
            }

            return service;
        }]);