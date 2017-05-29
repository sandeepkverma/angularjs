/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var intouch = intouch || {};
intouch.geofence = $
		.extend(
				{},
				{
					drawnItems:{},
					map:{},
					layer:{},
					el:{
						geofenceName:$(".geofencename"),
						geofenceDescription:$("#txtgeofencedescription"),
						geofenceList:$(".geofencelist"),
						drawToolBar :$(".leaflet-draw-toolbar-top")
					},
					geofenceOperation:"C",
					geofenceDataList:{},
					radius : null,
					actionType : "create",
					actionCreateEdit:"C",
					map_geofence : undefined,
					loadMap : function(mapContainer) {
						var map = L.map(mapContainer, {
							center : [ 28.61, 77.23 ],
							zoom : 11,
							minZoom : 4,
							maxZoom : 18,
							zoomControl : false,
							contextmenuWidth : 140,
							zoomAnimation : false,
						}).setView([ 28.61, 77.23 ], 5);
						var subDomains = [ 'tile1', 'tile2', 'tile3', 'tile4',
								'tile5' ];
						var mmisub = ['mt0', 'mt1', 'mt2', 'mt3',
								'mt4', 'mt5' ];
						var mmi = new L.tileLayer(
								'http://{s}.mapmyindia.com/advancedmaps/v1/'
										+ map_key
										+ '/still_map/{z}/{x}/{y}.png', {
									attribution : "Map Data &copy; MapmyIndia",
									maxZoom : 18,
									minZoom : 4,
									subdomains : mmisub
								});

						var img = new L.tileLayer(
								'http://{s}.nrsc.gov.in/tilecache/tilecache.py/1.0.0/bhuvan_imagery2/{z}/{x}/{y}.png',
								{
									attribution : "Satellite Imagery &copy; Bhuvan (NRSC, ISRO)",
									maxZoom : 18,
									minZoom : 4,
									subdomains : subDomains
								});
						var hybrid = new L.tileLayer(
								'http://{s}.nrsc.gov.in/tilecache/tilecache.py/1.0.0/bhuvan_imagery2/{z}/{x}/{y}.png',
								{
									attribution : "Map Data © MapmyIndia, Satellite Imagery &copy; Bhuvan (NRSC, ISRO)",
									maxZoom : 18,
									minZoom : 4,
									subdomains : subDomains
								});
						var hyb = new L.tileLayer(
								'http://{s}.mapmyindia.com/advancedmaps/v1/'
										+ map_key
										+ '/base_hybrid/{z}/{x}/{y}.png', {
									opacity : 0.6,
									subdomains : mmisub
								});
						var label = new L.tileLayer(
								'http://{s}.mapmyindia.com/advancedmaps/v1/'
										+ map_key
										+ '/base_label/{z}/{x}/{y}.png', {
									subdomains : mmisub
								});
						
						var mbUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
	                    var grayscale = L.tileLayer(mbUrl, {id: 'examples.map-20v6611k'});
	                    
                       var m = {};
						
						if(mapLayers[0]==1)
						mmi.addTo(map);
						else if(mapLayers[0]==2)
						img.addTo(map);
						else if(mapLayers[0]==3)
						hybrid.addTo(map);
						for ( var i in mapLayers) {
							if (mapLayers[i] == 1)
								m["MapmyIndia"]= mmi;
							if (mapLayers[i] == 2)
								m["Bhuvan"]= img;
							if (mapLayers[i] == 3)
								m["Hybrid"]=hybrid;
						}
						L.control.layers(m).addTo(map);
						map.on('baselayerchange', function(eo) {
							if (eo.name == "Hybrid") {
								map.addLayer(hyb);
								map.addLayer(label);
								hyb.bringToFront();
								label.bringToFront();
							} else {

								map.removeLayer(label);
								map.removeLayer(hyb);
							}
						});
						L.control.zoom({
							position : "topright"
						}).addTo(map);
						return map;

					},
					init : function(data) {
						this.map_geofence = intouch.geofence
						.loadMap('map_geofence');
						
						
						var drawnItems = new L.FeatureGroup();
						this.drawnItems = drawnItems;
						this.map_geofence.addLayer(drawnItems);

						// Initialise the draw control and pass it the FeatureGroup of editable layers
						drawControl = new L.Control.Draw({
							 position: 'topright',
							    draw: {
							        polyline: false,
							        polygon: {
							            allowIntersection: false, // Restricts shapes to simple polygons
							            drawError: {
							                color: '#e1e100', // Color the shape will turn when intersects
							                message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
							            },
							            shapeOptions: {
							                color: '#E5862D'
							            }
							        },
							        circle: {}, // Turns off this drawing tool
							        rectangle:false,
							        marker: {
							            
							        }
							    },
						    edit: {
						        featureGroup: drawnItems,
						        remove: false
						    }
						    
						});
						this.drawControl = drawControl;
						this.map_geofence.addControl(drawControl);
						
						this.map_geofence.on('draw:created', function (e) {
							
							if(intouch.geofence.map_geofence.getZoom()>=10){
								var type = e.layerType,
								layer = e.layer;
							if(!$.isEmptyObject(intouch.geofence.layer))
								{
								drawnItems.removeLayer(intouch.geofence.layer);
								if (type === 'marker') {
									try{
										intouch.geofence.map_geofence.removeLayer(intouch.geofence.circleMarkers[intouch.geofence.preGeofenceId]);
									}catch(e){
										
									}
								}
								}
							layer.flag = "I";
								intouch.geofence.layer = layer;
								intouch.geofence.layerType = type;
							if (type === 'marker') {
								var arrGeofenceId = new Array();
								for(var id in intouch.geofence.circleMarkers){
									arrGeofenceId.push(id);
									}
								arrGeofenceId.sort();
								var geofenceId;
								if(arrGeofenceId.length > 0)
									{
									 geofenceId = parseInt(arrGeofenceId[arrGeofenceId.length-1])+1;	
									}
								else{
									 geofenceId = 1;
								}
								
								layer.geofenceId = geofenceId;
								intouch.geofence.preGeofenceId = geofenceId;
								var markerCircle = L.circle(layer.getLatLng(),100).addTo(intouch.geofence.map_geofence);
								intouch.geofence.circleMarkers[geofenceId] = markerCircle;
								
							}

							drawnItems.addLayer(layer);
							}
							else{
								alert("Please set zoom level 10 or higher to create geofence.");
							}
						});
						
						this.map_geofence.on('draw:edited', function (e) {
						    var layers = e.layers;
						   
						    layers.eachLayer(function (layer) {
						        //do whatever you want, most likely save back to db
						    	var lay = layer;
						    });
						});
						this.map_geofence.on('draw:editresize', function (e) {
						   if(e.layer instanceof L.Circle)
							   {
							   $(".radius").remove();
							   var radius = e.layer.getRadius()/1000;
							   radius = radius.toFixed(2);
							   $(".leaflet-draw-tooltip").append('<div class="radius"><span>Radius: </span>'+radius+'km</div>');
							   }
						});
						this.map_geofence.on('draw:editmove', function (e) {
							   if(e.layer instanceof L.Marker)
								   {
								   intouch.geofence.markerCircleLayer = e.layer;
								   var geofenceId;
								   if(e.layer.geofenceId !== undefined)
									   {
									    geofenceId = e.layer.geofenceId;   
									   }
								   else{
									   geofenceId = intouch.geofence.selectedGeofenceId;
								   }
								  var circleMarker = intouch.geofence.circleMarkers[geofenceId];
								  circleMarker.setLatLng(e.layer.getLatLng());
								   }
							});
						this.map_geofence.on('draw:editstop', function (e) {
//							   if(intouch.geofence.markerCircleLayer instanceof L.Marker)
//								   {
//								   var layer = intouch.geofence.markerCircleLayer;
//								   var geofenceId;
//								   if(layer.geofenceId !== undefined)
//									   {
//									    geofenceId = layer.geofenceId;   
//									   }
//								   else{
//									   geofenceId = intouch.geofence.selectedGeofenceId;
//								   }
//								  var circleMarker = intouch.geofence.circleMarkers[geofenceId];
//								  circleMarker.setLatLng(layer.getLatLng());
//								   }
							   
							   if(intouch.geofence.layer !== undefined)
								   {
								  var layer = intouch.geofence.layer;
								    if(layer.flag == "U")
									   {
								    	intouch.geofence.actionMode = "U";
									   var myStyle = {
//											    "color": "#ff7800",
//											    "weight": 5,
//											    "opacity": 0.65
											};
									   intouch.geofence.map_geofence.removeLayer(layer);
									   var data = intouch.geofence.allGeofenceData[intouch.geofence.selectedGeofenceId];
										
										var geometry = data.geometry;
										var geofenceId = data.id;
										var longitude = data.geometry.coordinates[0];
										var latitude = data.geometry.coordinates[1];
										var radius = data.buffer;
										if(radius == undefined)
										{ 
										radius = 100; 
										}
										var geofenceName = data.name;
										var type = data.type;
										
										var layer;
										if(type == "Circle")
											{
											layer = L.circle([latitude, longitude], radius).addTo(intouch.geofence.map_geofence);
											}
										else{
											layer = L.geoJson(geometry, {
											    style: myStyle
											}).addTo(intouch.geofence.map_geofence);	
											if(type == "Point") 
												{
												intouch.geofence.map_geofence.removeLayer(intouch.geofence.circleMarkers[intouch.geofence.selectedGeofenceId]);
												var markerCircle = L.circle([latitude, longitude],  100).addTo(intouch.geofence.map_geofence);
												intouch.geofence.circleMarkers[intouch.geofence.selectedGeofenceId] = markerCircle;
												}
										}
										layer.bindPopup(geofenceName);
										intouch.geofence.geofenceLayers[intouch.geofence.selectedGeofenceId] = layer;
									   }
								   }
							});
						 
						
						
						drawControl.setDrawingOptions({
						    rectangle: {
						        shapeOptions: {
						            color: '#dddddd'
						        }
						    }
						});
						//hide geofence creation controls
						
						this.el.drawToolBar = $(".leaflet-draw-toolbar-top");
					},
					hideCreateToolBar:function()
					{
						this.el.drawToolBar.hide();
					},
					showCreateToolBar:function(){
						this.el.drawToolBar.show();
					},
					validateGeofenceForm:function(Elements){
						var flag = true;
						
						if($.isEmptyObject(this.drawnItems._layers))
							{
							flag = false;
							alert("Please create geofence !");
							}
						else if($.trim($(".geofencename").val()) == ""){
							flag = false;
							alert("Geofence name is mandatory !");
						}
							
						return flag;
					},
					getGeofenceType:function(){
						var geofenceType;
						switch (this.layerType) {
						case "marker":
							geofenceType="Point";
							break;
						case "polygon":
							geofenceType="Polygon";
							break;
						case "circle":
							geofenceType="Circle";
						 break;

						default:
							break;
						}
						return geofenceType;
					},
					
					
					randerAllGeofence:function(data){
						
						this.removeLayers(intouch.geofence.geofenceLayers,intouch.geofence.circleMarkers);
						var data = data.data;
						this.geofenceLayers = {};
						this.circleMarkers = {};
						this.allGeofenceData = {};
						for(var index in data)
							{
							
						var geometry = data[index].geometry;
						var geofenceId = data[index].id;
						this.allGeofenceData[geofenceId] = data[index];
						var longitude = data[index].geometry.coordinates[0];
						var latitude = data[index].geometry.coordinates[1];
						var radius = data[index].buffer;
						if(radius == undefined)
							{
							radius = 100;
							}
						var geofenceName = data[index].name;

						var myStyle = {
//						    "color": "#ff7800",
//						    "weight": 5,
//						    "opacity": 0.65
						};
						
						var layer;
						if(data[index].type == "Circle")
							{
							layer = L.circle([latitude, longitude], radius).addTo(this.map_geofence);
							}
						else{
							layer = L.geoJson(geometry, {
							    style: myStyle
							}).addTo(this.map_geofence);	
							if(data[index].type == "Point") 
								{
								var markerCircle = L.circle([latitude, longitude],  100).addTo(this.map_geofence);
								this.circleMarkers[geofenceId] = markerCircle;
								}
						}
						
						layer.bindPopup(geofenceName);
						
						
						this.geofenceLayers[geofenceId] = layer;
							}
					},
					removeLayer:function(layer)
					{
						this.map_geofence.removeLayer(layer);
					},
					removeLayers:function(layers,markerCircles)
					{
						for(var id in layers){
							this.map_geofence.removeLayer(layers[id]);
							}
						for(var id in markerCircles){
							this.map_geofence.removeLayer(markerCircles[id]);
							}
					},
					
					
					createGeofence : function(e) {

						if (intouch.geofence.circle !== undefined) {
							this.removeLayer(intouch.geofence.circle);
						}

						var zoomLevel = intouch.geofence.map_geofence.getZoom();
						var bound = intouch.geofence.map_geofence.getBounds();
						var oneLatLng = bound._northEast;
						var otherLatLng = bound._southWest;
						var distance = oneLatLng.distanceTo(otherLatLng);
						var disMeter = Math.floor(distance / 4);
						$(".slider-geozone").slider("setValue", disMeter);

						if (zoomLevel >= 10) {
							if (zoomLevel == 10) {
								intouch.geofence.circle = L.circle(e.latlng,
										36000);
								$(".slider-geozone").slider("setValue", 36000);
							} else {
								intouch.geofence.circle = L.circle(e.latlng,
										disMeter);
							}
						} else {
							alert("Please zoom in level 10 or higher to create geofence.")
							return false;
						}

						this.addLayer(intouch.geofence.circle);
						var bound = intouch.geofence.circle.getBounds();
						var bounds = L.latLngBounds(bound.getSouthWest(), bound
								.getNorthEast());
					},
					
					resetGeofenceState:function(){
						if(intouch.geofence.layer !== undefined)
						   {
						  var layer = intouch.geofence.layer;
						    if(layer.flag == "U")
							   {
						    	intouch.geofence.actionMode = "U";
							   var myStyle = {
//									    "color": "#ff7800",
//									    "weight": 5,
//									    "opacity": 0.65
									};
							   intouch.geofence.map_geofence.removeLayer(layer);
							   var data = intouch.geofence.allGeofenceData[intouch.geofence.selectedGeofenceId];
								
								var geometry = data.geometry;
								var geofenceId = data.id;
								var longitude = data.geometry.coordinates[0];
								var latitude = data.geometry.coordinates[1];
								var radius = data.buffer;
								var geofenceName = data.name;
								var type = data.type;
								
								var layer;
								if(type == "Circle")
									{
									layer = L.circle([latitude, longitude], radius).addTo(intouch.geofence.map_geofence);
									}
								else{
									layer = L.geoJson(geometry, {
									    style: myStyle
									}).addTo(intouch.geofence.map_geofence);	
									if(type == "Point") 
										{
										intouch.geofence.map_geofence.removeLayer(intouch.geofence.circleMarkers[intouch.geofence.selectedGeofenceId]);
										var markerCircle = L.circle([latitude, longitude],  100).addTo(intouch.geofence.map_geofence);
										intouch.geofence.circleMarkers[intouch.geofence.selectedGeofenceId] = markerCircle;
										}
								}
								layer.bindPopup(geofenceName);
								intouch.geofence.geofenceLayers[intouch.geofence.selectedGeofenceId] = layer;
							   }
						   }
					},

					centerMap : function(e) {
						intouch.geofence.map_geofence.panTo(e.latlng);
					},

					zoomIn : function(e) {
						intouch.geofence.map_geofence.zoomIn();
					},

					zoomOut : function(e) {
						intouch.geofence.map_geofence.zoomOut();
					},
					getMap : function() {
						return this.map_geofence;
					},
					sliderValue : function(e) {
						try {
							this.radius = e.value;
							intouch.geofence.circle.setRadius(e.value);
						} catch (e) {
						}
					},
					getZoomLevel : function(type) {
						switch (type) {
						case "HOUSE_NUMBER":
						case "HOUSE_NAME":
							return 18;
							break;
						case "POI":
						case "STREET":
							return 17;
							break;

						case "SUBSUBLOCALITY":
							return 16;
							break;
						case "VILLAGE":
						case "SUB_LOCALITY":
							return 15;
							break;
						case "PINCODE":
						case "SUB_DISTRICT":
						case "LOCALITY":
							return 14;
							break;
						case "CITY":
						case "DISTRICT":
							return 13;
							break;
						case "STATE":
							return 12;
							break;
						default:
							break;
						}

					},
					createGeofenceMarker:function(latlng){
						var myIcon = L.icon({
						    iconUrl: 'images/marker.png',
						    iconAnchor: [20, 48]
						});

						this.geofenceMarker = L.marker(latlng, {icon: myIcon}).addTo(this.map_geofence);
						
					},
					removeGeofenceMarker:function(marker){
						if (this.geofenceMarker !== undefined) {
						this.map_geofence.removeLayer(marker);
						}
					},
					searchLocation : function(address) {
						intouch.geofence.searchicon = $("#searchlocation")
								.parent().find(".iconchange");
						intouch.geofence.searchicon
								.removeClass("icon icon-Search");
						intouch.geofence.searchicon
								.addClass("fa fa-spinner fa-spin");
						intouch.ajax("searchlocation", "location=" + address
								+ "", intouch.callBack.searchLocation);
					},
					locationData : function(data, options) {
						var lat, lng, type;
						if (options !== undefined) {
							lat = data[1];
							lng = data[0];
							type = $("#hdntype").val();
						} else {
							lat = data.lat;
							lng = data.lng;
							type = data.type;
						}
						var latLng = L.latLng(lat, lng);
						var zoomLevel = this.getZoomLevel(type);
						this.getMap().setView(latLng, zoomLevel);
						
							this.removeGeofenceMarker(this.geofenceMarker);
						
						this.createGeofenceMarker(latLng);
						intouch.geofence.searchicon
								.removeClass("fa fa-spinner fa-spin");
						intouch.geofence.searchicon
								.addClass("icon icon-Search");
					},
					saveGeofence : function(data, options) {
						if (data.status == 200) {
							alert("Geofence saved successfully.");
							
							intouch.ajax(apiUrl + "getGeofence", "token="+ token + "",
									intouch.callBack.getGeofenceList);
							intouch.geofence.actionMode = "AC"; 
							intouch.geofence.resetGeofenceCreation();
							
							//refresh geozone list in alarm tab.
							intouch.geofence.refreshGeozoneList();
						}else if (data.status == 405) {
							alert("Geofence already exist.");
						}else if(data.status == 701){
							alert("Edge cutting polygon is not allowed.");
						}else{
							alert(data.message);
						}
					},
					updateGeofence : function(data, options) {
						if (data.status == 200) {
						alert("Geofence update successfully.");
						intouch.ajax(apiUrl + "getGeofence", "token="+ token + "",
								intouch.callBack.getGeofenceList);
						intouch.geofence.resetGeofenceCreation();
						
						//refresh geozone list in alarm tab.
						intouch.geofence.refreshGeozoneList();
						} else if (data.status == 402) {
							alert("Geofence not found.");
						}else if (data.status == 405) {
							alert("Geofence already exist.");
						}else if(data.status == 701){
						alert("Edge cutting polygon is not allowed.");
						}else{
							alert(data.message);
						}
					},
					resetGeofenceCreation:function(){
						$("#searchlocation").val("");
						$(".geofencename").val("");
						intouch.geofence.geofenceOperation = "";
						if(intouch.geofence.selectedGeofenceId != undefined){
							intouch.geofence.selectedGeofenceId = "";
						}
						
						try{
							intouch.geofence.removeGeofenceMarker(intouch.geofence.geofenceMarker);	
						}
						catch(e){
						}
						
						var toolbar;
						for (var toolbarId in drawControl._toolbars) {
						    toolbar = drawControl._toolbars[toolbarId];
						    if (toolbar instanceof L.EditToolbar) {
						    	intouch.geofence.toolbar = toolbar._modes.edit.handler; 
						        toolbar._modes.edit.handler.disable();
						    }
						}
						intouch.geofence.drawnItems.removeLayer(intouch.geofence.layer);
						if(intouch.geofence.actionMode == "C")
							{
							try{
							intouch.geofence.map_geofence.addLayer(intouch.geofence.layer);
							}
							catch(e){}
							}
						intouch.geofence.actionCreateEdit = "C";
						intouch.geofence.showCreateToolBar();
//						intouch.geofence.layer = {};
					},
					deleteGeofence : function(data, options) {
						
						intouch.geofence.map_geofence.removeLayer(intouch.geofence.geofenceLayers[options.geofenceId]);
						alert("Geofence delete successfully.");
						intouch.geofence.resetGeofenceCreation();
						intouch.ajax(apiUrl + "getGeofence", "token="
								+ token + "",
								intouch.callBack.getGeofenceList);

						
						//refresh geozone list in alarm tab.
						intouch.geofence.refreshGeozoneList();
					},
					editGeofence : function(data, options) {

					},
					getGeofence : function(data, options) {

					},
					refreshGeozoneList:function(){
						var options = new Array();
						options.push("geozone");
						options.push(false);
						intouch.ajax(apiUrl+"getusergeofence", "token=" + token, intouch.callBack.getusergeofencecallback,options,'',false);
					},
					resetGeofenceForm : function() {

						$("#searchlocation").val("");
						$(".geofencename").val("");
						$(".slider-geozone").slider("setValue", 0);
						if (intouch.geofence.circle !== undefined) {
							intouch.geofence.map_geofence
									.removeLayer(intouch.geofence.circle);
						}
						$("#alarmvehiclelist").find("li").eq(0).find("a")
								.trigger("click");
						$("#alarmmobilelist").find("li").eq(0).find("a")
								.trigger("click");
						$("#alarmemaillist").find("li").eq(0).find("a")
								.trigger("click");
					},
					geofenceList : function(response, options) {
						// alert(JSON.stringify(data));
						this.randerAllGeofence(response);
						this.displayGeofenceList(response);
					},
					displayGeofenceList:function(response){
						try{
							intouch.geofence.geofencetable.destroy();
						}catch(e){
							
						}
						intouch.geofence.geofenceDataList = {};
						var rows = "";
						var count = 1;
						var data=response.data;
						var radius ="";
						var geofenceType = "";
						for ( var geofence in data) {
							intouch.geofence.geofenceDataList[data[geofence].id] = data[geofence]
							if(data[geofence].buffer !== undefined){
								//radius = parseInt(data[geofence].buffer);
								radius = Math.round(data[geofence].buffer);
							}else{
								if(data[geofence].type == "Point"){
									radius = "100";
								}else{
									radius = "-";	
								}
							}
							
							if(data[geofence].type == "Circle"){
								geofenceType = '<i class="fa fa-circle-o" aria-hidden="true"></i>';
							}else if(data[geofence].type == "Point"){
								geofenceType = '<i class="fa fa-map-marker" aria-hidden="true"></i>';
							}else if(data[geofence].type == "Polygon"){
								geofenceType = '<i class="fa fa-map-o" aria-hidden="true"></i>';
							}
							
							rows = rows
									+ "<tr  class='geofencelist' type="+data[geofence].type+" geofenceid="
									+ data[geofence].id
									+ " isSchoolMark=" 
									+ data[geofence].isSchool
									+ ">"
									+ "<td>"
									+ data[geofence].id
									+ "</td>"
									+ "<td data-order='"+data[geofence].type+"'>"
									+ geofenceType
									+ "</td>"
									+ "<td title='Show' class='geofencelist viewgeofence pointer'>"
									+ data[geofence].name
									+ "</td>"
									+ "<td>"
									+ radius
									+ "</td>"
									+ "<td data-order='"+data[geofence].creationTime+"'>"
									+ Util
											.UnixDateTime(data[geofence].creationTime)
									+ "</td>"
									+ "<td>"
									+ data[geofence].createdByName
									+ "</td>"
									+ '<td><a href="#" data-toggle="class"><i class="fa fa-edit text-success editgeofence geozoneaction pointer" title="edit"></i><i class="fa fa-times text-danger  deletegeofence pointer" title="delete"></i></a></td>'
									+ "</tr>";
							count++;
						}
						$("#tblgeofence").html(rows);
						
						intouch.geofence.geofencetable = $('#geofencetable').DataTable({
							"aaSorting" : [ [ 0, 'asc' ] ],
							"destroy" : true,
							"iDisplayLength" : 100,
							"scrollCollapse" : true,
							"retrieve" : true,
							"scrollY" : "68vh",
							// "bSort": true,
							"bPaginate" : true,
							"lengthChange" : false,
							
							// "sScrollY": "auto",
							"info" : false,
							// "sScrollXInner": "1000px",
							// "sScrollX": "100%",
							// "sScrollY": "0px",
							// "bAutoWidth": true,
							// "pagingType": "full",
							"oLanguage" : {
								"sSearch" : ""
							},
							"dom" : 'ftp',
							"sPaginationType" : "simple_numbers"
//							"aoColumnDefs" : [ {
//								'bSortable' : false,
//								'aTargets' : [ 0 ]
//							} ]
						});
					}
				});

$(document)
		.ready(
				function() {
					$(document).off("click", ".deletegeofence");
					$(document)
							.on(
									"click",
									".deletegeofence",
									function() {
										
										try{
											intouch.geofence.map_geofence.removeLayer(intouch.geofence.layer);
											}
											catch(e){}
											
										
										var selectTr = $(this)
										.closest("tr");
								var geofenceId = selectTr
										.attr("geofenceid");
										var layer = intouch.geofence.geofenceLayers[geofenceId];
										intouch.geofence.map_geofence
										.fitBounds(
												layer.getBounds(),
												{
													maxZoom : 18
												});
										var r = confirm("Do you really want to delete selected geofence?");
										if (r == true) {
											
											// hide this

//											$(".creategeofence").parent()
//													.hide();
											
											intouch.geofence
													.resetGeofenceForm();
											// reset geofence action to create
											intouch.geofence.actionType = "create";
											intouch.ajax(apiUrl + "deleteGeofence","geozoneId="+ geofenceId+ "&token="
								+ token + "",
															intouch.geofence.deleteGeofence,{geofenceId:geofenceId});

										}
					 				});
					
					$(document).off("click",".editgeofence");
					$(document).on("click",".editgeofence",function(){
						intouch.geofence.geofenceOperation = "U";
						var selectedTr = $(this).closest("tr");
						var geofenceId = selectedTr
								.attr("geofenceid");
						var displayName = selectedTr
						.children().eq(2).text();
						$(".geofencename").val(displayName);
						
						var isSchoolMark = selectedTr.attr("isSchoolMark");
						if(isSchoolMark != 'undefined' && isSchoolMark){
							$(".isSchool").prop("checked",true);
						}else{
							$(".isSchool").prop("checked",false);
						}
						if(!$.isEmptyObject(intouch.geofence.layer))
							{
							intouch.geofence.drawnItems.removeLayer(intouch.geofence.layer);
							if(intouch.geofence.actionCreateEdit !== "C")
								{
									intouch.geofence.map_geofence.addLayer(intouch.geofence.layer);
								
								}
							}
						  intouch.geofence.actionCreateEdit = "U";
				
						intouch.geofence.selectedGeofenceId = geofenceId;
						var layer = intouch.geofence.geofenceLayers[geofenceId];
						intouch.geofence.prevGeofenceStatus = {};
						
						intouch.geofence.prevGeofenceStatus[intouch.geofence.selectedGeofenceId] = layer;
						
						if(intouch.geofence.geofenceDataList[geofenceId].type == "Circle")
							{	
							intouch.geofence.drawnItems.addLayer(layer);
							intouch.geofence.layer = layer;
							}
						else{
						
						layer.eachLayer(function(lay){intouch.geofence.editGeofenceLayer = lay});
						intouch.geofence.drawnItems.addLayer(intouch.geofence.editGeofenceLayer);
						
						intouch.geofence.layer = intouch.geofence.editGeofenceLayer;
						
						}
						intouch.geofence.layer.flag = "U";
						try{
							intouch.geofence.map_geofence.removeLayer(intouch.geofence.circleMarkers[intouch.geofence.preGeofenceId]);	
						}catch(e){}
						
						
						 $(".create_new_geofence").show();
						 $(".my_zones").hide();
						 
						var toolbar;
						for (var toolbarId in drawControl._toolbars) {
						    toolbar = drawControl._toolbars[toolbarId];
						    if (toolbar instanceof L.EditToolbar) {
						    	intouch.geofence.toolbar = toolbar._modes.edit.handler; 
						        toolbar._modes.edit.handler.enable();
						    }
						}
						
						
						intouch.geofence.el.geofenceName.val(intouch.geofence.geofenceDataList[geofenceId].name);
						intouch.geofence.map_geofence
						.fitBounds(
								layer.getBounds(),
								{
									maxZoom : 18
								});

						$(".creategeofence").parent().show();
						intouch.geofence.hideCreateToolBar();
					});
					
					
					$(document).off("click", ".viewgeofence");
					$(document).on("click",".viewgeofence",
						function() {
							var selectedTr = $(this).closest("tr");

							var geofenceId = selectedTr.attr("geofenceid");
							var type = selectedTr.attr("type");
							if(!$.isEmptyObject(intouch.geofence.preViewGeofence)){
								try{
									intouch.geofence.circleMarkers[intouch.geofence.preViewGeofence.prevViewGeofenceId].setStyle({color:"rgb(0, 51, 255)",fillColor:"rgb(0, 51, 255)"});
								}catch(e){}
								intouch.geofence.preViewGeofence.setStyle({color:"rgb(0, 51, 255)",fillColor:"rgb(0, 51, 255)"});
							}
							var layer = intouch.geofence.geofenceLayers[geofenceId];
							intouch.geofence.preViewGeofence = layer;
							if(type == "Point"){
								layer.prevViewGeofenceId = geofenceId;
								intouch.geofence.circleMarkers[geofenceId].setStyle({color:"#00e6e6",fillColor:"#4dffff"});	
							}else{
								layer.setStyle({color:"#00e6e6",fillColor:"#4dffff"});
							}
							
							//show bind popup 
							layer.openPopup();
							intouch.geofence.map_geofence.fitBounds(layer.getBounds(),{
								maxZoom : 18
							});
					});

					$(document).off("click",".geofence-form .input-group-addon");
					$(document).on("click",".geofence-form .input-group-addon",
						function() {
							var locValue = $.trim($("#searchlocation").val());
							if (locValue !== "") {
								var x = $("#hdnlon").val();
								var y = $("#hdnlat").val();
								if ($("#searchlocation").val() ===   $("#hdnaddress").val()) {
									intouch.geofence.searchicon = $("#searchlocation")
											.parent().find(".iconchange");
									intouch.geofence.searchicon
											.removeClass("icon icon-Search");
									intouch.geofence.searchicon
											.addClass("fa fa-spinner fa-spin");

									$.ajax({
										url : "decode?x=" + x + "&y=" + y
									}).done(function(data) {
										var point = data.split("$");
										intouch.geofence.locationData(point, {
											type : "auto"
										})
									});
								} else {
									intouch.geofence.searchLocation(locValue);
								}
							} else {
								alert("Please enter location");
							}
					});

				});

				$(document).on('click', '.creategeofence', function() {
					//hide this
					//$(this).parent().hide();
					//intouch.geofence.resetGeofenceForm();
					intouch.geofence.actionMode = "C";
					intouch.geofence.resetGeofenceCreation();
					// reset geofence action to create
					intouch.geofence.geofenceOperation = "C"
					intouch.geofence.actionType = "create";
					intouch.geofence.showCreateToolBar();
					intouch.geofence.actionCreateEdit = "C";
					 
					var layer = intouch.geofence.layer;
					if(layer.flag == "I"){
						if(intouch.geofence.layerType == "marker"){
						   intouch.geofence.map_geofence.removeLayer(intouch.geofence.circleMarkers[intouch.geofence.layer.geofenceId]);
						}
						intouch.geofence.map_geofence.removeLayer(layer);
						  
					}
					intouch.geofence.layer = {};
				});
				
				$(document).on("keydown",".searchlocation",
					function(e) {
						if (e.which === 13) {
							if ($.trim($(this).val()) !== "") {
								var x = $("#hdnlon").val();
								var y = $("#hdnlat").val();
								//if (x != undefined && x != "") {
								if ($("#searchlocation").val() ===   $("#hdnaddress").val()) {
									intouch.geofence.searchicon = $("#searchlocation")
											.parent().find(".iconchange");
									intouch.geofence.searchicon
											.removeClass("icon icon-Search");
									intouch.geofence.searchicon
											.addClass("fa fa-spinner fa-spin");

									$.ajax({
										url : "decode?x=" + x + "&y=" + y
									}).done(function(data) {
										var point = data.split("$");
										intouch.geofence.locationData(point, {
											type : "auto"
										})
									});
								} else {
									intouch.geofence.searchLocation($.trim($(this).val()));
								}
							} else {
								alert("Please enter location");
							}
						}
					});

$("#geofencebtn").click(function() {
	var isSchoolMark = "";
	if(isSchool){
		isSchoolMark = '<input class="isSchool" type="checkbox"><label for="isSchool">&nbsp;Mark as School<label>';
	}
	
	var geoZone = '<div class="">'
		+ '              <div class="form-group">'
		+ '<h5>Search Location</h5>'
		+ '  <div class="input-group date col-sm-12">'
		+ '  <input class="form-control searchlocation" id="searchlocation" type="text">'
		+ '<span class="input-group-addon btn btn-default">'
		+ '  <span class="icon icon-Search iconchange"></span>'
		+ '</span>'
		+ '</div>'
		+ '</div>'
		+ '<div class="form-group">'
		+ '<h5>Geofence Name</h5>'
		+ '<div class="input-group date col-sm-12">'
		+ '<input class="form-control geofencename" placeholder="Enter geofence name" type="text">'
		+ isSchoolMark
		+ '</div>'
		+ '</div>'
		+'<br>'
	+ '<div class="form-group" style="margin-left: 108px;">'
	+ '<div class="row col-sm-4">'
	+ '	<button type="submit" class="btn  btn-primary" id="generategeofence">Submit</button>'
	+ '</div>'
	+ '<div class="row col-sm-8">'
	+ '		<button type="button" class="btn  btn-primary creategeofence" >Cancel</button>'
	+ '	</div>'
	
	+ '</div>';
	$(".geofence-form").html(geoZone);
	$(".map_geofence").show();
	$(".creategeofence").show();

	$("#searchlocation").autoSuggest("autoSuggest", {
		asHtmlID : "searchlocation",
		selectedItemProp : "addr",
		searchObjProps : "addr",
		resultsHighlight : false
	}, "");
	if (intouch.geofence.map_geofence === undefined) {
		
		
		intouch.geofence.init();
	}
	else{
		intouch.geofence.map_geofence.invalidateSize();
	}
	//To Load Geofence List
	if($.isEmptyObject(intouch.geofence.geofenceDataList)){
		intouch.ajax(apiUrl + "getGeofence", "token="
				+ token+ "",
				intouch.callBack.getGeofenceList);
	}
	
});

$(document).on("click","#generategeofence",function(){
	var Elements = intouch.geofence.el;
	if(intouch.geofence.validateGeofenceForm(Elements)){
		var name = $(".geofencename").val();
		var description = Elements.geofenceDescription.val();
		var type = intouch.geofence.getGeofenceType();
		var isSchoolMark = false;
		if($(".isSchool").is(':checked')){
			isSchoolMark = true;
		}
		if(intouch.geofence.geofenceOperation == "U"){
			type = intouch.geofence.geofenceDataList[intouch.geofence.selectedGeofenceId].type;	
		}
		
		var arrLatitude= new Array();
		var arrLongitude = new Array();
		var radius = "";
		if(type === "Circle"){
			radius = intouch.geofence.layer.getRadius();
			var latlng = intouch.geofence.layer.getLatLng();
			arrLatitude.push(latlng.lat);			
			arrLongitude.push(latlng.lng);
		}else if(type === "Polygon"){
			var latlngs = intouch.geofence.layer.getLatLngs();
			for(var index in latlngs){
				arrLatitude.push(latlngs[index].lat);
				arrLongitude.push(latlngs[index].lng);

			}
		}
		else if(type === "Point"){
			var latlng = intouch.geofence.layer.getLatLng();
			arrLatitude.push(latlng.lat);			
			arrLongitude.push(latlng.lng);
		}
		
		if(intouch.geofence.geofenceOperation == "C"){
			intouch.ajax(apiUrl + "createGeofence", "token=" + token+"&accountid="+uAccId
				+"&name="+name+"&latitude="+arrLatitude
				+"&longitude="+arrLongitude+"&radius="+radius+"&type="+type+"&isSchool="+isSchoolMark,intouch.geofence.saveGeofence);
		}else if(intouch.geofence.geofenceOperation == "U"){
			intouch.ajax(apiUrl + "updateGeofence", "token=" + token+"&accountid="+uAccId
				+"&name="+name+"&latitude="+arrLatitude
				+"&longitude="+arrLongitude+"&radius="+radius+"&type="+type+"&isSchool="+isSchoolMark+"&id="+intouch.geofence.selectedGeofenceId,intouch.geofence.updateGeofence);
			}	
		}
});
$(document).on("click", "#uploadgeofencebutton", function() {
	 $(".preloader").css('display','block');
});
$("#uploadGeofenceFrame").load(function(){
$(".preloader").css('display','none');
var json = $.parseJSON($("#uploadGeofenceFrame").contents().text());
if (json.status == "1") {
	intouch.ajax(apiUrl + "getGeofence", "token="
			+ token+ "",
			intouch.callBack.getGeofenceList);
$("#geofencefile").val("");
}
alert(json.message);
});