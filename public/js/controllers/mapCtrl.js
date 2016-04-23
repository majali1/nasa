'use strict'

angular.module('nasaApp')
    .controller('mapCtrl', ['$rootScope', '$scope', '$timeout', 'util', 'esriLib', 'weatherService', 'diseaseService',
        function($rootScope, $scope, $timeout, util, esriLib, weatherService, diseaseService){
            $scope.JordanExtent = {};

            $scope.bufferDistance = 1;

            $scope.GoHome = function(){
                $rootScope.map.setExtent($scope.JordanExtent);
            };

            $scope.countries = [];

            util.HttpRequest.Query({url: 'countries.json', data: {}}, function(response){
                $scope.countries = response;
            });

            util.HttpRequest.Query({url: 'Diseases.json', data: {}}, function(response){
                var diseases = _.uniq(_.map(response, function(item){
                    return item.Disease;
                }));
               $scope.diseases = diseases;
            });

            $scope.ZoomToCountry = function(){
                util.HttpRequest.Get({url: 'https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson', data: {}}, function(response){


                    $scope.filteredCountry = _.filter(response.features, function(item){
                        return item.properties.name.toLowerCase() == $scope.selectedCountry.CountryName.toLowerCase();
                    })[0];
                    var _symbol;
                    _symbol = esriLib.GetSimpleFillSymbol("STYLE_SOLID", "STYLE_SOLID", [0,0,175, 4], 3, [125,125,125,0.35]);
                    var corLength = $scope.filteredCountry.geometry.coordinates.length;
                    var polygon = esriLib.CreatePolygon($scope.filteredCountry.geometry.coordinates[0]);
                    var graphic = esriLib.CreateGraphic(polygon, _symbol, {},{});
                    $rootScope.map.graphics.clear();
                    $rootScope.map.graphics.add(graphic);

                    var _point = esriLib.CreatePoint( $scope.selectedCountry.CapitalLongitude,$scope.selectedCountry.CapitalLatitude);
                    //var converted = esriLib.ConvertXYToLngLat(_point);
                    //$rootScope.map.centerAndZoom(_point, 4);
                    $rootScope.map.setExtent(polygon.getExtent(), true);
                });
            };

            $scope.GetDiseaseDataByCountry = function(){
                util.HttpRequest.Query({url: 'Diseases.json', data: {}}, function(response){
                   var filteredDiseases = _.filter(response, function(item){
                      return item.Disease.toLowerCase() === $scope.selectedDisease.toLowerCase()
                       && item.Location.toLowerCase() == $scope.selectedCountry.CountryName.toLowerCase();
                   });
                    var _symbol;
                    var selectedColor;
                   if(filteredDiseases.length > 0){

                       selectedColor = getColor(filteredDiseases[0].Rating);
                       _symbol = esriLib.GetSimpleFillSymbol("STYLE_SOLID", "STYLE_SOLID",[50,125,125,0.35] , 2, selectedColor);
                       var polygon = esriLib.CreatePolygon($scope.filteredCountry.geometry.coordinates[0]);
                       var graphic = esriLib.CreateGraphic(polygon, _symbol,{}, {});
                       $rootScope.map.graphics.clear();
                       $rootScope.map.graphics.add(graphic);
                   }else{
                       selectedColor = getColor(0);
                       _symbol = esriLib.GetSimpleFillSymbol("STYLE_SOLID", "STYLE_SOLID",[50,125,125,0.35] , 2, selectedColor);
                       var polygon = esriLib.CreatePolygon($scope.filteredCountry.geometry.coordinates[0]);
                       var graphic = esriLib.CreateGraphic(polygon, _symbol,{}, {});
                       $rootScope.map.graphics.clear();
                       $rootScope.map.graphics.add(graphic);
                   }
                });
            };

            function getColor(rateNo){
                var result = "";
                switch(rateNo){
                    case 1:
                        result = [255,6,0,.6];
                        break;
                    case 2:
                        result = [255,54,1,.6];
                        break;
                    case 3:
                        result = [255,128,2,.6];
                        break;
                    case 4:
                        result = [255,201,4,.6];
                        break;
                    case 5:
                        result = [255,250,5,.6];
                        break;
                    default:
                        result = [0, 255, 0,.6];
                        break;
                }
                return result;
            }

            require([
                    "esri/map",
                    "esri/toolbars/navigation",
                    "dojo/on",
                    "dojo/parser",
                    "dijit/registry",
                    "dijit/Toolbar",
                    "dijit/form/Button",
                    "esri/dijit/Scalebar",
                    "esri/graphic",
                    "esri/virtualearth/VETiledLayer",
                    "dojo/domReady!",
                    "esri/tasks/query",
                    "esri/layers/FeatureLayer",
                    "dijit/popup",
                    "dojo/dom-style",
                    "esri/dijit/HomeButton"],
                function (Map, Navigation, on, parser, registry, Toolbar, Button, Scalebar, Graphic, VETiledLayer,
                          Query, FeatureLayer, dijitPopup, domStyle,HomeButton){
                    $scope.JordanExtent = new esri.geometry.Extent({"xmin": 3511287.45, "ymin": 3258357.48,
                        "xmax": 4611980.65, "ymax": 3992152.95, "spatialReference":{"wkid":102100}});

                    parser.parse();
                    $rootScope.map = new esri.Map("mapdiv", {
                        sliderOrientation: "vertical",
                        sliderPosition: "bottom-right",
                        sliderStyle: "large"
                    });

                    $scope.veTileLayer = new esri.virtualearth.VETiledLayer({
                        bingMapsKey: "AhVz53PE5a05Yi0ygzaeB-VbHAAuSXNcIbo6SRrE2hnwfuqAKs-yAfCqN906zxso",
                        mapStyle: esri.virtualearth.VETiledLayer.MAP_STYLE_AERIAL
                    });

                    $rootScope.map.addLayer($scope.veTileLayer);

                    var scalebar = new Scalebar({
                        map: $rootScope.map,
                        // "dual" displays both miles and kilmometers
                        // "english" is the default, which displays miles
                        // use "metric" for kilometers
                        scalebarUnit: "metric"
                    });



                    /*
                    util.HttpRequest.Get({url: 'https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson', data: {}}, function(response){
                        console.log(response);

                        var jordan = _.filter(response.features, function(item){
                            return item.properties.name.toLowerCase() == "jordan";
                        })[0];
                        var _symbol;
                        _symbol = esriLib.GetSimpleFillSymbol("STYLE_SOLID", "STYLE_SOLID", [0,0,175, 4], 3, [125,125,125,0.35]);
                        var polygon = esriLib.CreatePolygon(jordan.geometry.coordinates[0]);
                        var graphic = esriLib.CreateGraphic(polygon, _symbol, {},{});
                        $rootScope.map.graphics.clear();
                        $rootScope.map.graphics.add(graphic);
                        console.log(jordan);
                    });

                    diseaseService.getDiseaseByName('Cholera');

                    util.HttpRequest.Query({url: '/countries.json', data: {}}, function(response){
                        console.log(response[0]);
                        var _point = esriLib.CreatePoint(response[0].CapitalLongitude, response[0].CapitalLatitude);
                        weatherService.getCountryWeatherData(response[0].CapitalLatitude, response[0].CapitalLongitude);
                    });
                    */
                });
        }]);
