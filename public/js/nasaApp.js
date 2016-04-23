'use strict'

angular.module('nasaApp', ['ui.router', 'ngResource', 'ui.bootstrap'])
    .config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider){
            $urlRouterProvider.otherwise(function($injector, $location) {
                var $state = $injector.get("$state");
                if($location.$$path == "" || $location.$$path == "/") {
                    $state.go("home");
                } else {
                    $state.go("404");
                }
            });

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'views/main.html',
                    controller: 'mainCtrl',
                    data: {
                        hasTopMenu: true,
                        hasSideMenu: true
                    }
                })
                .state('map', {
                    url: '/map',
                    templateUrl: 'views/map.html',
                    controller: 'mapCtrl',
                    data: {
                        hasTopMenu: false,
                        hasSideMenu: false
                    }
                });
        }]).run(['$rootScope', '$state','$window',
        function($rootScope, $state, $window){
            $rootScope.$on("$stateChangeStart", function(event, toState, toParam, fromState, fromParam){
                $rootScope.stateName = toState.name;
            });

        }]);