'use strict'

angular.module('nasaApp')
    .factory('esriLib',['$rootScope', '$q', 'util', 'esriLoader',
        function($rootScope, $q, util, esriLoader){

            var service = {};

            esriLoader.require([
                "esri/map",
                "esri/layers/ArcGISDynamicMapServiceLayer",
                "esri/layers/FeatureLayer",
                "esri/symbols/SimpleLineSymbol",
                "esri/symbols/SimpleFillSymbol",
                "esri/symbols/SimpleMarkerSymbol",
                "esri/symbols/PictureMarkerSymbol",
                "esri/symbols/TextSymbol",
                "esri/symbols/Font",
                "esri/renderers/SimpleRenderer",
                "esri/layers/LabelLayer",
                "esri/Color",
                "esri/layers/ImageParameters",
                "esri/virtualearth/VETiledLayer",
                "esri/tasks/RelationshipQuery",
                "esri/tasks/QueryTask",
                "esri/tasks/query",
                "esri/geometry/webMercatorUtils",
                "esri/tasks/geometry",
                "esri/tasks/BufferParameters",
                "esri/InfoTemplate",
                "esri/graphic",
                "esri/layers/GraphicsLayer",
                "esri/geometry/Point",
                "esri/graphicsUtils",
                "esri/geometry/Circle",
                "esri/tasks/ClassBreaksDefinition",
                "esri/tasks/AlgorithmicColorRamp",
                "esri/tasks/GenerateRendererParameters",
                "esri/tasks/GenerateRendererTask",
                "esri/renderers/smartMapping",
                "esri/dijit/Legend",
                "dijit/TooltipDialog",
                "dijit/popup",
                "dojo/dom-style"
            ], function(map, ArcGISDynamicMapServiceLayer, FeatureLayer, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, PictureMarkerSymbol,
                        TextSymbol, Font, SimpleRenderer, LabelLayer, Color, ImageParameters, VETiledLayer, RelationshipQuery, QueryTask, Query, webMercatorUtils,
                        BufferParameters, InfoTemplate, Graphic, GraphicsLayer, Point, GraphicsUtils, Circle, ClassBreaksDefinition,
                        AlgorithmicColorRamp, GenerateRendererParameters, GenerateRendererTask, smartMapping, Legend,TooltipDialog,dijitPopup,domStyle){

                service.legendObj;

                service.CreateFeatureLayerInstance = function(_layerId, _index, _outFields, _infoTemplate){
                    var _featureLayer = new FeatureLayer(GenerateMapServerUrl(_index),
                        {
                            id: _layerId,
                            outFields: _outFields,
                            infoTemplate: _infoTemplate
                        });
                    return _featureLayer;
                }

                service.CreateLegend = function(map, layer, field){
                    if(service.legendObj){
                        service.legendObj.destroy();
                        domConstruct.destroy(dom.byId("legendDiv"));
                    }

                    var legendDiv = domConstruct.create("div", {
                        id: "legendDiv"
                    }, dom.byId("legendWrapper"));

                    service.legendObj = new Legend({
                        map: map,
                        layerInfos: [{
                            layer: layer,
                            title: "Census Attribute: " + field
                        }]
                    }, legendDiv);
                    legend.startup();
                }

                service.CreateFeatureLayerByCollection = function(_collection, _layerId, _infoTemplate){
                    var _featureLayer = new FeatureLayer(_collection, {
                        id: _layerId,
                        infoTemplate: _infoTemplate,
                        mode: FeatureLayer.MODE_SNAPSHOT,
                        outFields: "*",
                        opacity: 0.8
                    });

                    return _featureLayer;
                }

                service.CreateDynamicLayerInstance = function(){
                    var strUrl = "";
                    if(portNo)
                        strUrl = "http://{ServerIP}:{portNo}/arcgis/rest/services/{MapServerName}/MapServer".format({ServerIP: ServerIP, portNo: portNo,  MapServerName: BaseMap});
                    else {
                        strUrl = "http://{ServerIP}/arcgis/rest/services/{MapServerName}/MapServer".format({ServerIP: ServerIP, MapServerName: BaseMap});
                    }
                    var _dynamicLayer = new ArcGISDynamicMapServiceLayer(strUrl);
                    return _dynamicLayer;
                }

                service.CreateFillRenderer = function(simpleLineStyle, simpleLineColor, simpleLineWidth, simpleFillStyle, fillColor){
                    var sls = new SimpleLineSymbol(GetSimpleLineSymbolStyle(simpleLineStyle), new Color(simpleLineColor), simpleLineWidth);
                    var FillSymbol = new SimpleFillSymbol(GetSimpleFillSymbolStyle(simpleFillStyle), sls, new Color(fillColor));
                    var Renderer = new SimpleRenderer(FillSymbol);

                    return Renderer;
                }

                service.GetSimpleRenderer = function(symbol){
                    return new SimpleRenderer(symbol);
                }

                service.GetSimpleFillSymbol = function(SimpleFillStyle, SimpleLineStyle, simpleLineColor, lineWeight, fillColor){
                    var _fillSymbol = //new SimpleFillSymbol().setColor(null).outline.setColor("blue");
                        new SimpleFillSymbol(
                            GetSimpleFillSymbolStyle(SimpleFillStyle),
                            new SimpleLineSymbol(
                                GetSimpleLineSymbolStyle(SimpleLineStyle),
                                new Color(simpleLineColor), lineWeight
                            ),
                            new Color(fillColor)
                        );
                    return _fillSymbol;
                }

                service.GetInfoTemplate = function(title, content){
                    var infoTemplate = new esri.InfoTemplate(title, content);
                    return infoTemplate;
                }

                service.CreateTooltipDialog = function(){
                    var dialog = new dijit.TooltipDialog({

                        style: "position: absolute; width: 250px; font: normal normal normal 10pt Helvetica;z-index:100"
                    });
                    return dialog;
                };

                service.CreateSimpleLineRenderer = function(simpleLineStyle, simpleLineColor, simpleLineWidth){
                    var sls = new SimpleLineSymbol(GetSimpleLineSymbolStyle(simpleLineStyle), new Color(simpleLineColor), simpleLineWidth);
                    var Renderer = new SimpleRenderer(sls);
                    return Renderer;
                };

                service.GetSimpleLineSymbol = function(SimpleLineStyle, simpleLineColor, simpleLineWidth){
                    var sls = new SimpleLineSymbol(GetSimpleLineSymbolStyle(SimpleLineStyle), new Color(simpleLineColor), simpleLineWidth);
                    return sls;
                }

                service.CreatePictureSymbolRenderer = function(imgUrl, imgType, imgWidth, imgHeight){
                    var symbol = new PictureMarkerSymbol({"angle":0,"xoffset":0,"yoffset":0,"type":"esriPMS",
                        "url": imgUrl,
                        "contentType": imgType,"width": imgWidth,"height": imgHeight});
                    return new SimpleRenderer(symbol);
                }

                service.GetPictureMarkerSymbol = function(imgUrl, imgType, imgWidth, imgHeight){
                    var symbol = new PictureMarkerSymbol({"angle":0,"xoffset":0,"yoffset":0,"type":"esriPMS",
                        "url": imgUrl,
                        "contentType": imgType,"width": imgWidth,"height": imgHeight});
                    return symbol;
                }

                service.GetSimpleMarkerSymbol = function(MarkerStyle, size, simpleLineStyle, simpleLineColor,
                                                         simpleLineWidth, markerColor){
                    var symbol = new SimpleMarkerSymbol(
                        GetSimpleMarkerSymbolStyle(MarkerStyle),
                        size,
                        service.GetSimpleLineSymbol(SimpleLineStyle, simpleLineColor, simpleLineWidth),
                        new Color(markerColor));
                    return symbol;
                }

                service.GetSimpleMarkerSymbolEmptyObj = function(){
                    return new SimpleMarkerSymbol();
                }

                service.CreateTextSymbol = function(text, color, fontSize, fontFamily, FontWeight){
                    var textSymbol = new esri.symbol.TextSymbol(text).setColor(new Color(color))
                        .setFont(new Font(fontSize, Font.STYLE_NORMAL, Font.VARIANT_NORMAL, FontWeight, fontFamily))
                        .setAlign(esri.symbol.TextSymbol.ALIGN_MIDDLE);
                    return textSymbol;
                }

                service.CreateLabelLayer = function(TextSymbolColor, fontSize, fontFamily, FontWeight, labelId){
                    var _textSymbol = new TextSymbol().setColor(new Color(TextSymbolColor));
                    _textSymbol.font.setSize(fontSize);
                    _textSymbol.font.setFamily(fontFamily);
                    _textSymbol.font.setWeight(FontWeight);
                    var _labelRenderer = new SimpleRenderer(_textSymbol);
                    var _labelLayer = new LabelLayer({id: labelId});

                    return {
                        labelRenderer: _labelRenderer,
                        LabelLayer: _labelLayer
                    }
                }

                service.CreateGraphic = function(_geometry, _symbol, _attr, _infoTemplate){
                    var graphic = new esri.Graphic(_geometry, _symbol, _attr, _infoTemplate);
                    return graphic;
                }

                service.CreateGraphicsLayer = function(){
                    var gl = new esri.layers.GraphicsLayer();
                    return gl;
                }

                service.GetGraphicsExtent = function(graphics){
                    var extent = esri.graphicsExtent(graphics);
                    return extent;
                }

                service.CreatePoint = function(xloc, yloc, spatialReference){
                    var point = new esri.geometry.Point(xloc, yloc, spatialReference);
                    return point;
                };

                service.CreatePolygon = function(coordinates){
                    return new esri.geometry.Polygon([coordinates]);
                };

                service.GetFontWeight = function(weight){
                    switch(weight){
                        case 'WEIGHT_BOLD':
                            return Font.WEIGHT_BOLD;
                            break;
                    }
                }

                service.ReturnBufferCircle = function(evt, radius){
                    return new esri.geometry.Circle({
                        center: evt.mapPoint,
                        geodesic: true,
                        radius: radius,
                        radiusUnit: esri.Units.KILOMETERS
                    });
                }

                function GetSimpleMarkerSymbolStyle(style){
                    switch (style) {
                        case 'STYLE_CIRCLE':
                            return SimpleMarkerSymbol.STYLE_CIRCLE;
                            break;
                        case 'STYLE_CROSS':
                            return SimpleMarkerSymbol.STYLE_CROSS;
                            break;
                        case 'STYLE_DIAMOND':
                            return SimpleMarkerSymbol.STYLE_DIAMOND;
                            break;
                        case 'STYLE_PATH':
                            return SimpleMarkerSymbol.STYLE_PATH;
                            break;
                        case 'STYLE_SQUARE':
                            return SimpleMarkerSymbol.STYLE_SQUARE;
                        case 'STYLE_X':
                            return SimpleMarkerSymbol.STYLE_X;
                            break;
                    }
                }

                function GetSimpleLineSymbolStyle(style){
                    switch (style) {
                        case 'STYLE_DASH':
                            return SimpleLineSymbol.STYLE_DASH;
                            break;
                        case 'STYLE_DASHDOT':
                            return SimpleLineSymbol.STYLE_DASHDOT;
                            break;
                        case 'STYLE_DASHDOTDOT':
                            return SimpleLineSymbol.STYLE_DASHDOTDOT;
                            break;
                        case 'STYLE_DOT':
                            return SimpleLineSymbol.STYLE_DOT;
                            break;
                        case 'STYLE_LONGDASH':
                            return SimpleLineSymbol.STYLE_LONGDASH;
                            break;
                        case 'STYLE_LONGDASHDOT':
                            return SimpleLineSymbol.STYLE_LONGDASHDOT;
                            break;
                        case 'STYLE_NULL':
                            return SimpleLineSymbol.STYLE_NULL;
                            break;
                        case 'STYLE_SHORTDASH':
                            return SimpleLineSymbol.STYLE_SHORTDASH;
                            break;
                        case 'STYLE_SHORTDASHDOT':
                            return SimpleLineSymbol.STYLE_SHORTDASHDOT;
                            break;
                        case 'STYLE_SHORTDASHDOTDOT':
                            return SimpleLineSymbol.STYLE_SHORTDASHDOTDOT;
                            break;
                        case 'STYLE_SHORTDOT':
                            return SimpleLineSymbol.STYLE_SHORTDOT;
                            break;
                        case 'STYLE_SOLID':
                            return SimpleLineSymbol.STYLE_SOLID;
                            break;
                    }
                }

                function GetSimpleFillSymbolStyle(style){
                    switch(style){
                        case 'STYLE_BACKWARD_DIAGONAL':
                            return SimpleFillSymbol.STYLE_BACKWARD_DIAGONAL;
                            break;
                        case 'STYLE_CROSS':
                            return SimpleFillSymbol.STYLE_CROSS;
                            break;
                        case 'STYLE_DIAGONAL_CROSS':
                            return SimpleFillSymbol.STYLE_DIAGONAL_CROSS;
                            break;
                        case 'STYLE_FORWARD_DIAGONAL':
                            return SimpleFillSymbol.STYLE_FORWARD_DIAGONAL;
                            break;
                        case 'STYLE_HORIZONTAL':
                            return SimpleFillSymbol.STYLE_HORIZONTAL;
                            break;
                        case 'STYLE_NULL':
                            return SimpleFillSymbol.STYLE_NULL;
                            break;
                        case 'STYLE_SOLID':
                            return SimpleFillSymbol.STYLE_SOLID;
                            break;
                        case 'STYLE_VERTICAL':
                            return SimpleFillSymbol.STYLE_VERTICAL;
                            break;
                    }
                }

                service.ConvertXYToLngLat = function(pnt){
                    var deferredService = $q.defer();
                    var geometryService = new esri.tasks.GeometryService('http://192.168.2.37:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer');
                    var PrjParams = new esri.tasks.ProjectParameters();
                    PrjParams.geometries = [pnt];
                    PrjParams.outSR = new esri.SpatialReference({wkid: 4326});
                    geometryService.project(PrjParams, function(output){
                        deferredService.resolve(output);
                    });
                    return deferredService.promise;
                };

                service.CreateSmartMapping = function(layer, field){
                    esri.renderers.smartMapping.createClassedColorRenderer({
                        layer: layer,
                        field: field,
                        basemap: $rootScope.map.getBasemap(),
                        classificationMethod: "natural-breaks",
                        numClasses: 8
                    }).then(function(response){
                        layer.setRenderer(response.renderer);
                        layer.redraw();
                        service.CreateLegend($rootScope.map, layer, field);
                    });
                }

                service.DefineClassBreakDefinition = function(fieldName, fromColor, toColor){
                    var classDef = new esri.tasks.ClassBreaksDefinition();
                    classDef.classificationField = fieldName;
                    classDef.classificationMethod = "natural-breaks";
                    classDef.breakCount = 8;

                    var colorRamp = new AlgorithmicColorRamp();
                    colorRamp.fromColor = new Color.fromHex(fromColor);
                    colorRamp.toColor = new Color.fromHex(toColor);
                    colorRamp.algorithm = "hsv"; // options are:  "cie-lab", "hsv", "lab-lch"

                    classDef.baseSymbol = new SimpleFillSymbol("solid", null, null);
                    classDef.colorRamp = colorRamp;

                    var params = new GenerateRendererParameters();
                    params.classificationDefinition = classDef;
                };

                service.InvokeRelationshipQuery = function(){
                    var relatedQuery = new RelationshipQuery();
                };

                service.InvokeQueryTask = function(qtOpts, showBlockUI, cbQuery){
                    var deferredQueryTask = $q.defer();

                    if(showBlockUI)
                        blockUI.start();
                    var _query = new Query();
                    _query.where = qtOpts.strWhere;
                    _query.returnGeometry = qtOpts.returnGeometry;
                    _query.outFields = qtOpts.outFields;

                    var _queryTask = new QueryTask(qtOpts.url);
                    _queryTask.on('error', function(msg){
                        blockUI.stop();
                        alert($rootScope.QueryTaskTitle, $rootScope.QueryTaskFailedMsg);
                    });

                    _queryTask.execute(_query, function(response){
                        var result = {};
                        blockUI.stop();
                        result.cbFN = cbQuery;
                        result.response = response;
                        deferredQueryTask.resolve(result);
                    });

                    return deferredQueryTask.promise;
                };

            });

            return service;
        }]);
