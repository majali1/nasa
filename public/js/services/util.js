'use strict'

angular.module('nasaApp')
    .factory('util', ['$rootScope', '$resource',
        function($rootScope, $resource){
            var util = {};
            util.HttpRequest = {};


            util.HttpRequest.Get = function(Obj, callback){
                var resourceObj = ConstructResource(Obj.url);
                var result = resourceObj.get(Obj.data, function(){
                    if(result.error){
                        alert('', 'Server error');

                    }
                    callback(result);
                }, function(error){
                    alert('Http', error.data);
                });
            };

            util.HttpRequest.Query = function(Obj, callback){
                var resourceObj = ConstructResource(Obj.url);
                Obj.isArray = false;
                var result = resourceObj.query(Obj.data, function(){
                    if(result.error){
                        alert('', 'Server error');

                    }
                    callback(result);
                },function(error){
                    alert('Http', error.data);
                });
            };

            util.HttpRequest.Save = function(Obj, callback){
                var resourceObj = ConstructResource(Obj.url);
                resourceObj.data = Obj.data;
                var result = resourceObj.save(Obj.data).$promise.then(function(res){
                    if(res.error){
                        alert('', 'Server error');

                    }
                    callback(res);
                }, function(error){
                    alert('Http', error.data);
                });
            };

            var ConstructResource = function(url){
                return $resource(url);
            }

            return util;
        }])
    .factory('HttpRequest', ['$resource', function($resource, url){
        return $resource(url);
    }]);
