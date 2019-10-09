$(function() { 
alert('ii ')
});
var myproject = myproject || {};
myproject.customRoute = (function(){
	'use strict';
	var map={};
	var routeObjDetails={};
	var routes={};
	var routePolylines={};
	var routesPoints={};
	var routePoints = {};
	var customRouteOperation={};
	var routeRequestData = {};
	var customRoute = $.extend({},{});
	var routeId = 0;
	var confirmationMessage = "Are sure to delete this ?";
	var routeListDetailsObj = {};
	var routeAssignDetailsObj = {};
	var getRouteAssigsFlag = true;
	var routeAssignOperationFlag = "";
	var routeAssignOperationId = "";
	var actualRoutePolyline = {};
	var timestamp=0;
	customRoute = { 					// expose functionality
			getMap : getMap, 
			init:init
	};
	
	
	// //////////////////////// functionality // ////////////////////////////////////////////////
	function init(){
		if ($.isEmptyObject(map)) {
			map = myproject.leafMap.loadMap('map_customroute',{doubleClickZoom:false});
			map.off('dblclick',mapdblClickHandler);
			map.on('dblclick',mapdblClickHandler);
			//add autosuggestion ctrol on map
			mmiAutosuggest.init(map);
		}else{
			map.invalidateSize();
		}
		
		el.routeMode();
		$('a[href="#customroutecreation"]').trigger('click');
		//initialize customRouteOperation
		customRouteOperation["operationMode"] = "I";
		customRouteOperation["routeId"] = generateRouteId();
		routeId = customRouteOperation.routeId;
		
		controller.getRouteList();
		
		
		
		
	}
	/**
	 * @name getMap
	 * @desc map
	 * @returns map
	 */
	function getMap(){
		return map;
	}
	
	/**
	 * @name remvoeLayer
	 * @desc remove feature layer from map.
	 * @param
	 * @returns
	 */
	function removeLayer(layer){
		map.removeLayer(layer);
	}
	
	/**
	 * @name addLayer
	 * @desc add feature layer to map.
	 * @param
	 * @returns
	 */
	function addLayer(layer){
		map.addLayer(layer);
	}
	function createPolyline(latlngs){
		var oldPolyline = routePolylines[routeId];
		if(oldPolyline == undefined)
			{	
			var options = {
					color: 'red'
			}
			var polyline = L.polyline(latlngs,options);
			routePolylines[routeId] = polyline;
			routes[routeId].addLayer(polyline);
			}
		else{
			updatePolyline(latlngs);
		}
		
	}
	function updatePolyline(latlngs){
		routePolylines[routeId].setLatLngs(latlngs);
	}
	function createMarker(latlng,id){
		var layerGroup = routes[routeId] || L.featureGroup();
		var markerHtml = '<div markerpointid='+id+'><span class="mmileaflet_cricon">'+id+'</span><i class="fa fa-map-marker fa-4x mmileaft_criconcolor"></i></div>'; 
			var markerIcon = L.divIcon({
			html : markerHtml,
			iconAnchor:[9,47]
//			popupAnchor: [0, -33]
		});
		var marker = L.marker(latlng,{draggable:true,icon : markerIcon});
//		var marker = L.marker(latlng,{draggable:true});
		marker.on('dblclick',markerDbclickHandler);
		marker.on('dragend',markerDragendHandler);
		marker["routeId"] = routeId;
		marker["routePointId"] = id;
		var points = routesPoints[routeId] || {};
//		var point = {};
//		point[id] = marker;
		points[id] = marker;
		routesPoints[routeId] = points;
		layerGroup.addLayer(marker);
		layerGroup.addTo(map);
		routes[routeId] = layerGroup;
		updateRouteRequestData();
	}
	function updateMarker(latlng,id){
		routesPoints[routeId][id].setLatLng(latlng);
	}
	function getRoutePointsCount(){
		var routeId = getRouteId();
		var routePoints = routesPoints[routeId];
		var count = 0;
		for(var id in routePoints){
			count++;
		}
		return count;
	}
	
	function getRouteList(){
		
	}
	function getRoute(){
		return routes[routeId];
	}
	function addRoute(route){
		
	}
	function removeRoute(){
		var route = getRoute();
		if(route !== undefined){
		//remove created route from map
		removeLayer(route);
//		if(getOperationMode() == "I")
//		{
			//remove route from object
			delete routes[routeId];
			var routePoints = getRoutePoints();			
			for(var id in routePoints)
				{
				//remove route points from object
				delete routesPoints[routeId][id]; 
				}
			//remove polyline from object
			delete routePolylines[routeId]
			
			//remove actual route polyline
			
			removeActualRoutePolyline();
			
//		}
		}
		
	}
	
	function getRoutesPointList(){
		
	}
	function getRoutePoints(){
		return routesPoints[routeId];
	}
	function getRoutePoint(routeId,id){
		
	}
	function removeRoutePoint(id){
		var flag = confirm(confirmationMessage);
		if(flag){
			removeLayer(routesPoints[routeId][id]);
			delete routesPoints[routeId][id];
			updateRouteRequestData();
			el.removeItem(id);	
			calculateRoute();
			el.updateMarkerSequence();
		}
	}
	function addRoutePoint(routeId,id){
		
	}
	
	function getRoutesPolylineList(){
		
	}
	function getRoutePolyline(routeId){
		
	}
	function addRoutePolyline(polyline){
		
	}
	function updateRoutePolyline(options){
		
	}
	function removeRoutePolyline(){
		var polyline = routePolylines[routeId];
			if(polyline != undefined)
			{
			 removeLayer(polyline);
			}
	}
	function getRouteId(){
		return customRouteOperation.routeId;
	}
	function getOperationMode(){
		return customRouteOperation.operationMode;
	}
	function generateRouteId(){
		if($.isEmptyObject(routeObjDetails)){
			return 1;
		}
	}
	function generateUniqueId(){
		if($.isEmptyObject(routesPoints)){
			return 1;
		}
		var count = 0;
		for(var index in routesPoints){
			var routePoints = routesPoints[index];
			for(var id in routePoints){
				var existId = parseInt(id);
				if(existId > count){
					count = existId;
				}
			}
		}
		return ++count;
	}
	
	function updateRouteRequestData(){
		var routeId = getRouteId();
		var pointCount = getRoutePointsCount(routeId);
		if(pointCount > 1)
			{
			var routePoints = getRoutePoints(routeId);
			processRoutePoints(routePoints);
			}
		
	
		
		function processRoutePoints(rPoints){
			var minId = 1,maxId=1,flag=true,start="",dest="",via="";
			//get minimum id
			for(var id in rPoints)
				{
				if(flag)
					{
					 minId = id;
					flag = false;
					}
				if(id<minId)
					{
					minId = id;
					}
				}
			//get max id
			for(var id in rPoints)
				{
				if(id>maxId)
					{
					maxId = id;
					}
				}
			var startPoint = rPoints[minId];
			var endPoint = rPoints[maxId];
			var startLatLng = startPoint.getLatLng();
			start = startLatLng.lat+","+startLatLng.lng;
			var endLatLng = endPoint.getLatLng();
			dest = endLatLng.lat+","+endLatLng.lng;
			var viaPoints = [];
			var viaFlag = true;
			for(var id in rPoints)
				{
				if(id != minId && id != maxId)
					{
					var latLngs = rPoints[id].getLatLng();
					var strVia = "";
					if(viaFlag){
						strVia = latLngs.lat+","+latLngs.lng;
						viaFlag = false;
					}
					else{
						strVia = "|"+latLngs.lat+","+latLngs.lng;
					}
					 
					viaPoints.push(strVia);
					
					}
				}
			
			via = viaPoints.toString();
			routeRequestData["start"] = start;
			routeRequestData["destination"] = dest;
			routeRequestData["viaPoints"] = via;
		}
	}
	function getStartPoint(){
		return routeRequestData.start;
	}
	function getDestinationPoint(){
		return routeRequestData.destination;
	}
	function getViaPoints(){
		return routeRequestData.viaPoints;
	}
	function getRouteParameters(){
		var parameters = "";
		parameters +="start="+getStartPoint();
		parameters +="&destination="+getDestinationPoint();
		parameters +="&viaPoints="+getViaPoints();
		return parameters;
	}
	
	
	function decodePath(encoded) {
		var pts = [];
		var index = 0, len = encoded.length;
		var lat = 0, lng = 0;
		while (index < len) {
		var b, shift = 0, result = 0;
		do {
		b = encoded.charAt(index++).charCodeAt(0) - 63;
		result |= (b & 0x1f) << shift;
		shift += 5;
		} while (b >= 0x20);

		var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
		lat += dlat;
		shift = 0;
		result = 0;
		do {
		b = encoded.charAt(index++).charCodeAt(0) - 63;
		result |= (b & 0x1f) << shift;
		shift += 5;
		} while (b >= 0x20);
		var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
		lng += dlng;
		pts.push([lat / 1E6, lng / 1E6]);
		}
		return pts;
		}
	function resetCustomRoute(){
		customRouteOperation["operationMode"] = "";
		el.showBtnCreateCustomRoute();
		removeRoute();
		el.routeItemContainer.html("");
		el.hideRouteCreationContainer();
		el.showRouteListItemContainer();
	}
	function getValidateRouteSubmitFlag(){
		if(getRoutePointsCount()>1 && routePolylines[routeId] != undefined)
			{
			return true;
			}
		else{
			return false;
		}
	}
	function updateAddress(latlng,id){
		myproject.ajax("getregeocode","lat="+latlng.lat+"&lng="+latlng.lng , callBack.getregeocodeData,{routePointId:id,latitude:latlng.lat,longitude:latlng.lng});
	}
	function updateRoutePointData(id,latlng,address){
		el.routeItemContainer.find('div[routepointid='+id+'][routeid='+routeId+']').find(".txtpointaddress").val(address);
		el.routeItemContainer.find('div[routepointid='+id+'][routeid='+routeId+']').find(".txtlatlng").val(latlng);
	}
	
	function calculateRoute(){
		var pointCount = getRoutePointsCount();
		if(pointCount >1){
			myproject.ajax("getcustomroute", getRouteParameters(), callBack.getRouteApiData);
		}else{
			alert("At least two point are required to calculate route.");
		}
	}
	
	function fitBoundMap(){
		var featureLayer = routes[routeId];
		if(featureLayer !== undefined)
			{
			map.fitBounds(featureLayer.getBounds(),{padding:[100,100]});
			}
	}
	
	function getRouteNameList(){
		var routeNameList ={};
		for(var routeId in routeListDetailsObj){
			routeNameList[routeId] = routeListDetailsObj[routeId].name;
		}
		return routeNameList;
			
	}
	
	function displayRoute(){
		
		var routeData = routeListDetailsObj[routeId];
		var points = routeData.points;
		var geozones = routeData.geozones;
		var index = 0;
		for(var id in points){
			createMarker([geozones[index].geometry.coordinates[1],geozones[index].geometry.coordinates[0]],points[id].geozoneId);
			index ++;
		}
		createPolyline(routeData.polylinePoints);
		fitBoundMap();
	}
	
	function removeActualRoutePolyline(){
		if(!$.isEmptyObject(actualRoutePolyline))
			{
			map.removeLayer(actualRoutePolyline);
			actualRoutePolyline = {};
			}
		
	}
	
	function disableRoutePoints(){
		var markers = routesPoints[routeId];
		for(var index in markers){
			markers[index].dragging.disable();
			markers[index].off('dblclick',markerDbclickHandler);

		}
	}
	
	
	
	
	///////////////////////////db functionality/////////////////////////////////////////////////////////////
	
	var controller = {
	
			getRouteList:function(){
		
				myproject.ajax(apiUrl + "getroutes", "token=" + token+"&accountId="+accountId, callBack.getRouteListData);
			},
			deleteRoute:function(routeId){
				myproject.ajax(apiUrl + "deleteroute", "token=" + token+"&routeId="+routeId, callBack.deleteRouteData);
			},
			saveRoute:function(route){
				myproject.ajax(apiUrl+"createroute",JSON.stringify(route), callBack.saveRouteData,{},"application/json");
			},
			updateRoute:function(route){
				myproject.ajax(apiUrl+"updateroute",JSON.stringify(route), callBack.updateRouteData,{},"application/json");
			},
			saveRouteAssign:function(routeAssign){
				myproject.ajax(apiUrl+"insertrouteassignment",JSON.stringify(routeAssign), callBack.saveRouteAssignData,{},"application/json");
			},
			updateRouteAssign:function(routeAssign){
				myproject.ajax(apiUrl+"updaterouteassignment",JSON.stringify(routeAssign), callBack.updateRouteAssignData,{},"application/json");
			},
			getRouteAssignList:function(timestamp){
				myproject.ajax(apiUrl + "getrouteassignments", "token=" + token+"&accountId="+accountId+"&timestamp="+timestamp, callBack.getRouteAssignListData);
			},
			deleteRouteAssign:function(routeAssignId){
				myproject.ajax(apiUrl + "deleterouteassign", "token=" + token+"&routeAssignId="+routeAssignId, callBack.deleteRouteAssignData);
			},
			getEvents:function(entityId,startTime,endTime,assignId){
				myproject.ajax(apiUrl+"getevents","token=" + token + "&entityId=" + entityId + "&startTime=" + startTime + "&endTime=" + endTime + "", callBack.getEventsData,{assignId:assignId});
			}
	};
	
	var callBack = {
			getRouteApiData:function(response,options){
				if(response.status === 200){
					var trips = response.data.results.trips;
					var routePoints =[];
					var totalDistance = 0,totalTime = 0;
					var arrTime = [],arrDistance=[];
					var durationInTraffic = "Not Available";
					if(response.data.results.duration_in_traffic != undefined){
						durationInTraffic = Util.getSecondsToHHMM(response.data.results.duration_in_traffic.value);
					}
					
					for(var index in trips){
						var duration = trips[index].duration;
						arrTime.push(duration);
						var length = trips[index].length;
						arrDistance.push(length);						
						var points = decodePath(trips[index].pts);
						routePoints = routePoints.concat(points);
					}
					el.updateRouteElements(arrTime,arrDistance,durationInTraffic);
					
					createPolyline(routePoints);
					}
			},
			getregeocodeData:function(response,options){
				var reGeocodeData = {};
				var formattedAddress = "NA";
				var id = options.routePointId;
				var latlng=options.latitude+","+options.longitude;
				if(response.status == 200)
					{
				 reGeocodeData = response.data.results[0];
				 formattedAddress = reGeocodeData.formatted_address;
				if(formattedAddress == "" || formattedAddress == undefined)
					{
					formattedAddress = "NA";
					}
					
					}	
				
				updateRoutePointData(id,latlng,formattedAddress);
			},
			saveRouteData:function(response,options){
				if(response.status == 200)
					{
					alert("Route save successfully.");
					controller.getRouteList();
					resetCustomRoute();
					}
				else{
					alert(response.message);
				}
			},
			updateRouteData:function(response,options){
				if(response.status == 200)
				{
				 alert("Route update successfully.");
				 controller.getRouteList();
				 resetCustomRoute();
				}
				else{
					alert(response.message);
				}
			},
			getRouteListData:function(response,options){
				if(response.status == 200)
					{
					routeListDetailsObj = response.data;
					el.displayRouteList();
					}
				else{
					alert(response.message);
				}
				
			},
			deleteRouteData:function(response,options){
				if(response.status == 200)
				{
				alert("Route deleted successfully.");
				controller.getRouteList();
				}
			else{
				alert(response.message);
			}
			},
			saveRouteAssignData:function(response,options){
				if(response.status == 200){
					alert("Route assignment save successfully.");
					controller.getRouteAssignList(0);
					el.resetRouteAssignment();
				}else{
					alert(response.message);
				}
			},
			updateRouteAssignData:function(response,options){
				if(response.status == 200){
					alert("Route assignment update successfully.");
					controller.getRouteAssignList(0);
					el.resetRouteAssignment();
				}else{
					alert(response.message);
				}
			},
			getRouteAssignListData:function(response,options){
				if(response.status == 200){
					//Added by Sumeet on 11th May 2017 (Instruct by Sachin)
					$(".i-calendar").trigger("click");
					routeAssignDetailsObj = response.data;
					el.displayRouteAssignmentList(routeAssignDetailsObj);
				}else{
					alert(response.message);
				}
			},
			deleteRouteAssignData:function(response,options){
				if(response.status == 200)
				{
				alert("Route Assignment deleted successfully.");
				controller.getRouteAssignList(0);
				}
			else{
				alert(response.message);
			}
			},
			getEventsData:function(response,options){
				if(response.status == 200)
				{
					$('tr[routeassignid='+options.assignId+']').find('.editrouteassign').trigger('click');
					//var response = '{"data":[{"id":466094636,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483209269,"insertTime":1483209894,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":195.0,"powerSupplyVoltage":12539.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 00:04:29","greenDriveTypeStr":"-"},{"id":466094635,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483209570,"insertTime":1483209894,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":200.0,"powerSupplyVoltage":12519.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 00:09:30","greenDriveTypeStr":"-"},{"id":466094634,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483209871,"insertTime":1483209894,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":209.0,"powerSupplyVoltage":12519.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 00:14:31","greenDriveTypeStr":"-"},{"id":466110066,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483210172,"insertTime":1483210192,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":215.0,"powerSupplyVoltage":12539.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 00:19:32","greenDriveTypeStr":"-"},{"id":466125264,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483210473,"insertTime":1483210486,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":208.0,"powerSupplyVoltage":12539.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 00:24:33","greenDriveTypeStr":"-"},{"id":466140366,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483210774,"insertTime":1483210785,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":215.0,"powerSupplyVoltage":12539.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 00:29:34","greenDriveTypeStr":"-"},{"id":466155958,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483211075,"insertTime":1483211090,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":243.0,"powerSupplyVoltage":12529.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 00:34:35","greenDriveTypeStr":"-"},{"id":466171073,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483211375,"insertTime":1483211390,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":220.0,"powerSupplyVoltage":12529.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 00:39:35","greenDriveTypeStr":"-"},{"id":466186131,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483211676,"insertTime":1483211693,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":216.0,"powerSupplyVoltage":12529.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 00:44:36","greenDriveTypeStr":"-"},{"id":466200254,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483211977,"insertTime":1483211995,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":212.0,"powerSupplyVoltage":12529.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 00:49:37","greenDriveTypeStr":"-"},{"id":466213972,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483212278,"insertTime":1483212295,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":214.0,"powerSupplyVoltage":12519.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 00:54:38","greenDriveTypeStr":"-"},{"id":466226871,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483212579,"insertTime":1483212592,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":224.0,"powerSupplyVoltage":12519.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 00:59:39","greenDriveTypeStr":"-"},{"id":466240834,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483212880,"insertTime":1483212893,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":227.0,"powerSupplyVoltage":12510.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 01:04:40","greenDriveTypeStr":"-"},{"id":466254931,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483213181,"insertTime":1483213196,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":223.0,"powerSupplyVoltage":12519.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 01:09:41","greenDriveTypeStr":"-"},{"id":466268492,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483213482,"insertTime":1483213490,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":202.0,"powerSupplyVoltage":12500.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 01:14:42","greenDriveTypeStr":"-"},{"id":466282161,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483213783,"insertTime":1483213791,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":208.0,"powerSupplyVoltage":12500.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 01:19:43","greenDriveTypeStr":"-"},{"id":466295531,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483214084,"insertTime":1483214098,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":209.0,"powerSupplyVoltage":12491.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 01:24:44","greenDriveTypeStr":"-"},{"id":466308421,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483214385,"insertTime":1483214399,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":197.0,"powerSupplyVoltage":12491.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 01:29:45","greenDriveTypeStr":"-"},{"id":466321104,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483214686,"insertTime":1483214701,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":197.0,"powerSupplyVoltage":12491.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 01:34:46","greenDriveTypeStr":"-"},{"id":466333734,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483214987,"insertTime":1483214995,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":205.0,"powerSupplyVoltage":12491.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 01:39:47","greenDriveTypeStr":"-"},{"id":466347070,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483215287,"insertTime":1483215304,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":203.0,"powerSupplyVoltage":12491.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 01:44:47","greenDriveTypeStr":"-"},{"id":466360131,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483215588,"insertTime":1483215600,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":218.0,"powerSupplyVoltage":12481.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 01:49:48","greenDriveTypeStr":"-"},{"id":466374017,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483215889,"insertTime":1483215900,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":207.0,"powerSupplyVoltage":12500.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 01:54:49","greenDriveTypeStr":"-"},{"id":466386982,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483216190,"insertTime":1483216201,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":233.0,"powerSupplyVoltage":12491.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 01:59:50","greenDriveTypeStr":"-"},{"id":466399786,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483216491,"insertTime":1483216503,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":199.0,"powerSupplyVoltage":12491.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 02:04:51","greenDriveTypeStr":"-"},{"id":466413057,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483216792,"insertTime":1483216808,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":203.0,"powerSupplyVoltage":12500.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 02:09:52","greenDriveTypeStr":"-"},{"id":466425224,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483217093,"insertTime":1483217109,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":222.0,"powerSupplyVoltage":12491.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 02:14:53","greenDriveTypeStr":"-"},{"id":466437633,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483217394,"insertTime":1483217404,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":217.0,"powerSupplyVoltage":12491.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 02:19:54","greenDriveTypeStr":"-"},{"id":466449708,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483217695,"insertTime":1483217707,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":196.0,"powerSupplyVoltage":12491.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 02:24:55","greenDriveTypeStr":"-"},{"id":466461228,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483217996,"insertTime":1483218008,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":208.0,"powerSupplyVoltage":12491.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 02:29:56","greenDriveTypeStr":"-"},{"id":466472985,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483218297,"insertTime":1483218311,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":220.0,"powerSupplyVoltage":12481.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 02:34:57","greenDriveTypeStr":"-"},{"id":466484701,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483218597,"insertTime":1483218612,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":197.0,"powerSupplyVoltage":12462.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 02:39:57","greenDriveTypeStr":"-"},{"id":466496257,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483218898,"insertTime":1483218909,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":221.0,"powerSupplyVoltage":12462.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 02:44:58","greenDriveTypeStr":"-"},{"id":466508481,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483219199,"insertTime":1483219212,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":206.0,"powerSupplyVoltage":12462.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 02:49:59","greenDriveTypeStr":"-"},{"id":466520380,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483219500,"insertTime":1483219516,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":227.0,"powerSupplyVoltage":12472.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 02:55:00","greenDriveTypeStr":"-"},{"id":466531410,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483219801,"insertTime":1483219811,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":216.0,"powerSupplyVoltage":12462.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 03:00:01","greenDriveTypeStr":"-"},{"id":466542889,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483220102,"insertTime":1483220118,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":215.0,"powerSupplyVoltage":12452.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 03:05:02","greenDriveTypeStr":"-"},{"id":466554016,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483220403,"insertTime":1483220411,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":202.0,"powerSupplyVoltage":12481.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 03:10:03","greenDriveTypeStr":"-"},{"id":466565251,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483220704,"insertTime":1483220718,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":6,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":209.0,"powerSupplyVoltage":12472.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 03:15:04","greenDriveTypeStr":"-"},{"id":466575991,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483221005,"insertTime":1483221019,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":211.0,"powerSupplyVoltage":12462.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 03:20:05","greenDriveTypeStr":"-"},{"id":466587201,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483221306,"insertTime":1483221322,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":245.0,"powerSupplyVoltage":12472.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 03:25:06","greenDriveTypeStr":"-"},{"id":466597847,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483221606,"insertTime":1483221617,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":288.0,"powerSupplyVoltage":12443.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 03:30:06","greenDriveTypeStr":"-"},{"id":466608718,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483221907,"insertTime":1483221923,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":247.0,"powerSupplyVoltage":12452.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 03:35:07","greenDriveTypeStr":"-"},{"id":466619262,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483222208,"insertTime":1483222219,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":213.0,"powerSupplyVoltage":12462.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 03:40:08","greenDriveTypeStr":"-"},{"id":466629361,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483222509,"insertTime":1483222520,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":220.0,"powerSupplyVoltage":12452.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 03:45:09","greenDriveTypeStr":"-"},{"id":466639473,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483222810,"insertTime":1483222824,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":232.0,"powerSupplyVoltage":12452.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 03:50:10","greenDriveTypeStr":"-"},{"id":466649905,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483223111,"insertTime":1483223118,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":212.0,"powerSupplyVoltage":12452.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 03:55:11","greenDriveTypeStr":"-"},{"id":466660000,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483223412,"insertTime":1483223428,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":210.0,"powerSupplyVoltage":12443.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 04:00:12","greenDriveTypeStr":"-"},{"id":466669668,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483223713,"insertTime":1483223725,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":203.0,"powerSupplyVoltage":12433.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 04:05:13","greenDriveTypeStr":"-"},{"id":466679625,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483224014,"insertTime":1483224029,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":204.0,"powerSupplyVoltage":12462.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 04:10:14","greenDriveTypeStr":"-"},{"id":466689368,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483224315,"insertTime":1483224329,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":212.0,"powerSupplyVoltage":12462.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 04:15:15","greenDriveTypeStr":"-"},{"id":466699315,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483224616,"insertTime":1483224630,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":212.0,"powerSupplyVoltage":12443.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 04:20:16","greenDriveTypeStr":"-"},{"id":466709581,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483224916,"insertTime":1483224932,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":219.0,"powerSupplyVoltage":12433.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 04:25:16","greenDriveTypeStr":"-"},{"id":466719904,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483225217,"insertTime":1483225234,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":214.0,"powerSupplyVoltage":12443.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 04:30:17","greenDriveTypeStr":"-"},{"id":466729999,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483225518,"insertTime":1483225531,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":229.0,"powerSupplyVoltage":12443.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 04:35:18","greenDriveTypeStr":"-"},{"id":466740002,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483225819,"insertTime":1483225833,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":222.0,"powerSupplyVoltage":12443.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 04:40:19","greenDriveTypeStr":"-"},{"id":466749944,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483226120,"insertTime":1483226134,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":224.0,"powerSupplyVoltage":12424.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 04:45:20","greenDriveTypeStr":"-"},{"id":466759628,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483226421,"insertTime":1483226434,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":226.0,"powerSupplyVoltage":12452.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 04:50:21","greenDriveTypeStr":"-"},{"id":466769724,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483226722,"insertTime":1483226736,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":222.0,"powerSupplyVoltage":12424.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 04:55:22","greenDriveTypeStr":"-"},{"id":466779493,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483227023,"insertTime":1483227033,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":235.0,"powerSupplyVoltage":12433.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 05:00:23","greenDriveTypeStr":"-"},{"id":466789633,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483227324,"insertTime":1483227334,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":214.0,"powerSupplyVoltage":12433.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 05:05:24","greenDriveTypeStr":"-"},{"id":466799985,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483227625,"insertTime":1483227635,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":219.0,"powerSupplyVoltage":12452.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 05:10:25","greenDriveTypeStr":"-"},{"id":466810248,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483227926,"insertTime":1483227936,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":227.0,"powerSupplyVoltage":12443.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 05:15:26","greenDriveTypeStr":"-"},{"id":466820877,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483228227,"insertTime":1483228242,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":200.0,"powerSupplyVoltage":12443.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 05:20:27","greenDriveTypeStr":"-"},{"id":466831263,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483228527,"insertTime":1483228540,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":202.0,"powerSupplyVoltage":12452.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 05:25:27","greenDriveTypeStr":"-"},{"id":466841564,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483228828,"insertTime":1483228841,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":200.0,"powerSupplyVoltage":12452.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 05:30:28","greenDriveTypeStr":"-"},{"id":466852163,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483229129,"insertTime":1483229141,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":6,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":194.0,"powerSupplyVoltage":12452.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 05:35:29","greenDriveTypeStr":"-"},{"id":466863263,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483229430,"insertTime":1483229442,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":203.0,"powerSupplyVoltage":12443.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 05:40:30","greenDriveTypeStr":"-"},{"id":466874298,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483229731,"insertTime":1483229743,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":209.0,"powerSupplyVoltage":12443.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 05:45:31","greenDriveTypeStr":"-"},{"id":466885262,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483230032,"insertTime":1483230040,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":207.0,"powerSupplyVoltage":12443.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 05:50:32","greenDriveTypeStr":"-"},{"id":466896472,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483230333,"insertTime":1483230341,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":217.0,"powerSupplyVoltage":12433.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 05:55:33","greenDriveTypeStr":"-"},{"id":466908165,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483230634,"insertTime":1483230643,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":206.0,"powerSupplyVoltage":12433.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 06:00:34","greenDriveTypeStr":"-"},{"id":466920042,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483230935,"insertTime":1483230947,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":188.0,"powerSupplyVoltage":12424.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 06:05:35","greenDriveTypeStr":"-"},{"id":466931681,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483231236,"insertTime":1483231249,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":211.0,"powerSupplyVoltage":12443.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 06:10:36","greenDriveTypeStr":"-"},{"id":466943826,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483231537,"insertTime":1483231554,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":211.0,"powerSupplyVoltage":12443.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 06:15:37","greenDriveTypeStr":"-"},{"id":466955546,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483231837,"insertTime":1483231851,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":203.0,"powerSupplyVoltage":12433.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 06:20:37","greenDriveTypeStr":"-"},{"id":466967110,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483232138,"insertTime":1483232146,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":223.0,"powerSupplyVoltage":12424.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 06:25:38","greenDriveTypeStr":"-"},{"id":466978998,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483232439,"insertTime":1483232447,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":220.0,"powerSupplyVoltage":12433.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 06:30:39","greenDriveTypeStr":"-"},{"id":466991381,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483232740,"insertTime":1483232748,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":208.0,"powerSupplyVoltage":12433.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 06:35:40","greenDriveTypeStr":"-"},{"id":467003826,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483233041,"insertTime":1483233049,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":216.0,"powerSupplyVoltage":12414.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 06:40:41","greenDriveTypeStr":"-"},{"id":467016366,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483233342,"insertTime":1483233355,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":207.0,"powerSupplyVoltage":12414.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 06:45:42","greenDriveTypeStr":"-"},{"id":467028653,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483233643,"insertTime":1483233656,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":209.0,"powerSupplyVoltage":12414.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 06:50:43","greenDriveTypeStr":"-"},{"id":467040469,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483233944,"insertTime":1483233956,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":207.0,"powerSupplyVoltage":12414.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 06:55:44","greenDriveTypeStr":"-"},{"id":467052689,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483234245,"insertTime":1483234258,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":213.0,"powerSupplyVoltage":12414.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 07:00:45","greenDriveTypeStr":"-"},{"id":467065706,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483234546,"insertTime":1483234563,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":215.0,"powerSupplyVoltage":12414.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 07:05:46","greenDriveTypeStr":"-"},{"id":467077760,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483234847,"insertTime":1483234860,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":203.0,"powerSupplyVoltage":12443.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 07:10:47","greenDriveTypeStr":"-"},{"id":467090747,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483235148,"insertTime":1483235161,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":198.0,"powerSupplyVoltage":12443.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 07:15:48","greenDriveTypeStr":"-"},{"id":467103759,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483235449,"insertTime":1483235462,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":195.0,"powerSupplyVoltage":12443.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 07:20:49","greenDriveTypeStr":"-"},{"id":467117099,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483235749,"insertTime":1483235761,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":230.0,"powerSupplyVoltage":12433.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 07:25:49","greenDriveTypeStr":"-"},{"id":467130761,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483236050,"insertTime":1483236064,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":214.0,"powerSupplyVoltage":12433.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 07:30:50","greenDriveTypeStr":"-"},{"id":467144619,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483236351,"insertTime":1483236365,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":231.0,"powerSupplyVoltage":12433.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 07:35:51","greenDriveTypeStr":"-"},{"id":467158642,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483236652,"insertTime":1483236666,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":215.0,"powerSupplyVoltage":12433.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 07:40:52","greenDriveTypeStr":"-"},{"id":467172378,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483236953,"insertTime":1483236971,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":226.0,"powerSupplyVoltage":12433.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 07:45:53","greenDriveTypeStr":"-"},{"id":467186019,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483237254,"insertTime":1483237262,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":204.0,"powerSupplyVoltage":12424.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 07:50:54","greenDriveTypeStr":"-"},{"id":467199906,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483237555,"insertTime":1483237563,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":220.0,"powerSupplyVoltage":12424.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 07:55:55","greenDriveTypeStr":"-"},{"id":467213522,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483237856,"insertTime":1483237866,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":220.0,"powerSupplyVoltage":12424.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 08:00:56","greenDriveTypeStr":"-"},{"id":467227007,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483238157,"insertTime":1483238172,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":208.0,"powerSupplyVoltage":12405.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 08:05:57","greenDriveTypeStr":"-"},{"id":467240343,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483238458,"insertTime":1483238473,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":200.0,"powerSupplyVoltage":12433.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 08:10:58","greenDriveTypeStr":"-"},{"id":467253983,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483238759,"insertTime":1483238774,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":203.0,"powerSupplyVoltage":12433.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 08:15:59","greenDriveTypeStr":"-"},{"id":467267766,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483239060,"insertTime":1483239075,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":191.0,"powerSupplyVoltage":12424.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 08:21:00","greenDriveTypeStr":"-"},{"id":467281014,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483239360,"insertTime":1483239376,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":7,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":182.0,"powerSupplyVoltage":12395.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 08:26:00","greenDriveTypeStr":"-"},{"id":467294007,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483239661,"insertTime":1483239669,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":217.0,"powerSupplyVoltage":12395.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 08:31:01","greenDriveTypeStr":"-"},{"id":467307595,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483239962,"insertTime":1483239974,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":208.0,"powerSupplyVoltage":12424.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 08:36:02","greenDriveTypeStr":"-"},{"id":467321695,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483240263,"insertTime":1483240279,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":210.0,"powerSupplyVoltage":12405.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 08:41:03","greenDriveTypeStr":"-"},{"id":467335194,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483240564,"insertTime":1483240580,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":232.0,"powerSupplyVoltage":12395.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 08:46:04","greenDriveTypeStr":"-"},{"id":467348707,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483240865,"insertTime":1483240875,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":219.0,"powerSupplyVoltage":12414.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 08:51:05","greenDriveTypeStr":"-"},{"id":467364021,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483241166,"insertTime":1483241181,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":232.0,"powerSupplyVoltage":12395.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 08:56:06","greenDriveTypeStr":"-"},{"id":467378047,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483241467,"insertTime":1483241479,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":224.0,"powerSupplyVoltage":12405.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 09:01:07","greenDriveTypeStr":"-"},{"id":467392449,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483241768,"insertTime":1483241778,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":225.0,"powerSupplyVoltage":12405.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 09:06:08","greenDriveTypeStr":"-"},{"id":467406636,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483242069,"insertTime":1483242081,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":267.0,"powerSupplyVoltage":12424.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 09:11:09","greenDriveTypeStr":"-"},{"id":467420203,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483242370,"insertTime":1483242376,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":196.0,"powerSupplyVoltage":12424.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 09:16:10","greenDriveTypeStr":"-"},{"id":467435558,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483242670,"insertTime":1483242685,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":213.0,"powerSupplyVoltage":12424.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 09:21:10","greenDriveTypeStr":"-"},{"id":467449744,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483242971,"insertTime":1483242984,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":8,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":214.0,"powerSupplyVoltage":12414.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 09:26:11","greenDriveTypeStr":"-"},{"id":467464551,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 70 m from Vodafone pin-201309","timestamp":1483243272,"insertTime":1483243285,"longitude":77.34624,"latitude":28.6126208,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":203.0,"powerSupplyVoltage":12395.0,"power":1,"gsmlevel":3,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 09:31:12","greenDriveTypeStr":"-"},{"id":467472558,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 47 m from Vodafone pin-201309","timestamp":1483243439,"insertTime":1483243451,"longitude":77.3463744,"latitude":28.6126624,"heading":40.0,"speed":7.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":215.0,"powerSupplyVoltage":14059.0,"power":1,"gsmlevel":3,"gpsSpeed":7.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"idle","currentEntityId":352,"durationStr":"-","movementStatusStr":"Idle","timestampStr":"01-01-2017 09:33:59","greenDriveTypeStr":"-"},{"id":467474283,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 48 m from Jay Ambe General Store pin-201309","timestamp":1483243472,"insertTime":1483243488,"longitude":77.3465088,"latitude":28.613072,"heading":217.0,"speed":9.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":198.0,"powerSupplyVoltage":14155.0,"power":1,"gsmlevel":5,"gpsSpeed":9.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:34:32","greenDriveTypeStr":"-"},{"id":467476152,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 61 m from Vodafone pin-201309","timestamp":1483243502,"insertTime":1483243526,"longitude":77.3462592,"latitude":28.6126432,"heading":125.0,"speed":10.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":199.0,"powerSupplyVoltage":14184.0,"power":1,"gsmlevel":3,"gpsSpeed":10.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:35:02","greenDriveTypeStr":"-"},{"id":467476151,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 54 m from Kamal Building pin-201309","timestamp":1483243526,"insertTime":1483243526,"longitude":77.3464512,"latitude":28.612336,"heading":202.0,"speed":6.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":191.0,"powerSupplyVoltage":14413.0,"power":1,"gsmlevel":3,"gpsSpeed":6.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"idle","currentEntityId":352,"durationStr":"-","movementStatusStr":"Idle","timestampStr":"01-01-2017 09:35:26","greenDriveTypeStr":"-"},{"id":467477982,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 23 m from Kamal Building pin-201309","timestamp":1483243558,"insertTime":1483243564,"longitude":77.3462784,"latitude":28.611936,"heading":0.0,"speed":7.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":192.0,"powerSupplyVoltage":14423.0,"power":1,"gsmlevel":3,"gpsSpeed":7.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"idle","currentEntityId":352,"durationStr":"-","movementStatusStr":"Idle","timestampStr":"01-01-2017 09:35:58","greenDriveTypeStr":"-"},{"id":467479903,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 22 m from Kamal Building pin-201309","timestamp":1483243573,"insertTime":1483243604,"longitude":77.3463232,"latitude":28.611808,"heading":117.0,"speed":11.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":202.0,"powerSupplyVoltage":14384.0,"power":1,"gsmlevel":3,"gpsSpeed":11.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:36:13","greenDriveTypeStr":"-"},{"id":467479901,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 19 m from Kamal Building pin-201309","timestamp":1483243579,"insertTime":1483243604,"longitude":77.3463616,"latitude":28.6117248,"heading":0.0,"speed":6.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":197.0,"powerSupplyVoltage":14404.0,"power":1,"gsmlevel":3,"gpsSpeed":6.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"idle","currentEntityId":352,"durationStr":"-","movementStatusStr":"Idle","timestampStr":"01-01-2017 09:36:19","greenDriveTypeStr":"-"},{"id":467479900,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 26 m from Kamal Building pin-201309","timestamp":1483243581,"insertTime":1483243604,"longitude":77.3463232,"latitude":28.6116864,"heading":196.0,"speed":9.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":195.0,"powerSupplyVoltage":14423.0,"power":1,"gsmlevel":3,"gpsSpeed":9.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:36:21","greenDriveTypeStr":"-"},{"id":467479899,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 14 m from Kushi Tailor pin-201309","timestamp":1483243601,"insertTime":1483243604,"longitude":77.3460096,"latitude":28.611168,"heading":238.0,"speed":6.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":191.0,"powerSupplyVoltage":14432.0,"power":1,"gsmlevel":2,"gpsSpeed":6.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"idle","currentEntityId":352,"durationStr":"-","movementStatusStr":"Idle","timestampStr":"01-01-2017 09:36:41","greenDriveTypeStr":"-"},{"id":467479898,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 12 m from Vishanl Studio pin-201309","timestamp":1483243603,"insertTime":1483243604,"longitude":77.345984,"latitude":28.6111232,"heading":207.0,"speed":14.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":190.0,"powerSupplyVoltage":14384.0,"power":1,"gsmlevel":2,"gpsSpeed":14.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:36:43","greenDriveTypeStr":"-"},{"id":467483062,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"114, Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 18 m from Balaji Aata Chakki pin-201309","timestamp":1483243661,"insertTime":1483243671,"longitude":77.3454208,"latitude":28.6099808,"heading":177.0,"speed":9.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":196.0,"powerSupplyVoltage":14461.0,"power":1,"gsmlevel":4,"gpsSpeed":9.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:37:41","greenDriveTypeStr":"-"},{"id":467485177,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"35, Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 105 m from Taxi Stand pin-201309","timestamp":1483243701,"insertTime":1483243714,"longitude":77.3454656,"latitude":28.6084864,"heading":209.0,"speed":9.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":187.0,"powerSupplyVoltage":14375.0,"power":1,"gsmlevel":5,"gpsSpeed":9.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:38:21","greenDriveTypeStr":"-"},{"id":467485176,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"35, Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 91 m from Taxi Stand pin-201309","timestamp":1483243708,"insertTime":1483243714,"longitude":77.345408,"latitude":28.608432,"heading":266.0,"speed":9.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":189.0,"powerSupplyVoltage":14394.0,"power":1,"gsmlevel":3,"gpsSpeed":9.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:38:28","greenDriveTypeStr":"-"},{"id":467485555,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"27, Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 25 m from Taxi Stand pin-201309","timestamp":1483243719,"insertTime":1483243721,"longitude":77.3447104,"latitude":28.6082816,"heading":203.0,"speed":20.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":190.0,"powerSupplyVoltage":14413.0,"power":1,"gsmlevel":3,"gpsSpeed":20.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:38:39","greenDriveTypeStr":"-"},{"id":467485748,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"27, Swami Kalyan Marg, Rajat Vihar, Block B, Sector 62A, Noida, Uttar Pradesh. 15 m from Taxi Stand pin-201309","timestamp":1483243722,"insertTime":1483243725,"longitude":77.344736,"latitude":28.6080832,"heading":169.0,"speed":28.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":190.0,"powerSupplyVoltage":14404.0,"power":1,"gsmlevel":3,"gpsSpeed":28.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:38:42","greenDriveTypeStr":"-"},{"id":467487617,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"12, Swami Kalyan Marg, Block A, Sector 55, Noida, Uttar Pradesh. 16 m from Mother Dairy pin-201307","timestamp":1483243743,"insertTime":1483243763,"longitude":77.3450176,"latitude":28.6062976,"heading":171.0,"speed":44.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":185.0,"powerSupplyVoltage":14423.0,"power":1,"gsmlevel":3,"gpsSpeed":44.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:39:03","greenDriveTypeStr":"-"},{"id":467487616,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"1, Swami Kalyan Marg, Block A, Sector 55, Noida, Uttar Pradesh. 41 m from Saraswati Shishu Mandir pin-201307","timestamp":1483243760,"insertTime":1483243763,"longitude":77.3453056,"latitude":28.6044224,"heading":170.0,"speed":46.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":184.0,"powerSupplyVoltage":14356.0,"power":1,"gsmlevel":3,"gpsSpeed":46.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:39:20","greenDriveTypeStr":"-"},{"id":467489947,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"46, Swami Kalyan Marg, Block E, Sector 55, Noida, Uttar Pradesh. 36 m from State Bank of India pin-201307","timestamp":1483243775,"insertTime":1483243808,"longitude":77.3455808,"latitude":28.6026144,"heading":172.0,"speed":51.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":192.0,"powerSupplyVoltage":14375.0,"power":1,"gsmlevel":3,"gpsSpeed":51.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:39:35","greenDriveTypeStr":"-"},{"id":467489946,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"31, Swami Kalyan Marg, Block E, Sector 55, Noida, Uttar Pradesh. 58 m from Sudarshan Hospital pin-201307","timestamp":1483243790,"insertTime":1483243808,"longitude":77.3458944,"latitude":28.6007392,"heading":172.0,"speed":46.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":193.0,"powerSupplyVoltage":14413.0,"power":1,"gsmlevel":4,"gpsSpeed":46.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:39:50","greenDriveTypeStr":"-"},{"id":467490119,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"1, Swami Kalyan Marg, Block C, Sector 56, Noida, Uttar Pradesh. 37 m from Sanatan Dharam Temple pin-201307","timestamp":1483243809,"insertTime":1483243812,"longitude":77.3460224,"latitude":28.59936,"heading":215.0,"speed":18.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":188.0,"powerSupplyVoltage":14413.0,"power":1,"gsmlevel":4,"gpsSpeed":18.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:40:09","greenDriveTypeStr":"-"},{"id":467490118,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Temple, Sector 22 Main Road, Block I, Sector 22, Noida, Uttar Pradesh. 30 m from Shiv Mandir pin-201301","timestamp":1483243811,"insertTime":1483243812,"longitude":77.3459072,"latitude":28.5993184,"heading":250.0,"speed":25.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":187.0,"powerSupplyVoltage":14394.0,"power":1,"gsmlevel":4,"gpsSpeed":25.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:40:11","greenDriveTypeStr":"-"},{"id":467492556,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"171, Sector 22 Main Road, Block Z, Sector 12, Noida, Uttar Pradesh. 20 m from Noida Sector 12 and 22 Bus Stop pin-201301","timestamp":1483243850,"insertTime":1483243864,"longitude":77.3438464,"latitude":28.5989888,"heading":262.0,"speed":21.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":193.0,"powerSupplyVoltage":14423.0,"power":1,"gsmlevel":5,"gpsSpeed":21.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:40:50","greenDriveTypeStr":"-"},{"id":467492899,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"338, Sector 22 Main Road, Block Z, Sector 12, Noida, Uttar Pradesh. 32 m from Sai Fabricators pin-201301","timestamp":1483243869,"insertTime":1483243871,"longitude":77.3423872,"latitude":28.5990784,"heading":294.0,"speed":27.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":195.0,"powerSupplyVoltage":14384.0,"power":1,"gsmlevel":5,"gpsSpeed":27.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:41:09","greenDriveTypeStr":"-"},{"id":467494774,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"1, Sector 22 Main Road, Block U, Sector 11, Noida, Uttar Pradesh. 42 m from Nehru Public International School pin-201301","timestamp":1483243893,"insertTime":1483243909,"longitude":77.3409472,"latitude":28.6004864,"heading":321.0,"speed":38.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":193.0,"powerSupplyVoltage":14394.0,"power":1,"gsmlevel":5,"gpsSpeed":38.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:41:33","greenDriveTypeStr":"-"},{"id":467494773,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"103, Block D, Sector 56, Noida, Uttar Pradesh. 56 m from Water Tank pin-201307","timestamp":1483243908,"insertTime":1483243909,"longitude":77.3399808,"latitude":28.60144,"heading":290.0,"speed":25.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":192.0,"powerSupplyVoltage":14471.0,"power":1,"gsmlevel":5,"gpsSpeed":25.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:41:48","greenDriveTypeStr":"-"},{"id":467495228,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"103, Block D, Sector 56, Noida, Uttar Pradesh. 26 m from Water Tank pin-201307","timestamp":1483243912,"insertTime":1483243919,"longitude":77.3397248,"latitude":28.6014336,"heading":254.0,"speed":23.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":192.0,"powerSupplyVoltage":14509.0,"power":1,"gsmlevel":5,"gpsSpeed":23.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:41:52","greenDriveTypeStr":"-"},{"id":467495458,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"32, Block T, Sector 11, Noida, Uttar Pradesh. 55 m from Water Tank pin-201301","timestamp":1483243922,"insertTime":1483243924,"longitude":77.3391104,"latitude":28.6009952,"heading":223.0,"speed":33.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":192.0,"powerSupplyVoltage":14394.0,"power":1,"gsmlevel":5,"gpsSpeed":33.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:42:02","greenDriveTypeStr":"-"},{"id":467497924,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"75, Narmada Marg, Block P, Sector 11, Noida, Uttar Pradesh. 26 m from Community Centre pin-201301","timestamp":1483243942,"insertTime":1483243973,"longitude":77.3375488,"latitude":28.5998112,"heading":229.0,"speed":43.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":193.0,"powerSupplyVoltage":14413.0,"power":1,"gsmlevel":3,"gpsSpeed":43.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:42:22","greenDriveTypeStr":"-"},{"id":467498188,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"7, Narmada Marg, Block R, Sector 11, Noida, Uttar Pradesh. 70 m from Santusti Restaurant pin-201301","timestamp":1483243975,"insertTime":1483243978,"longitude":77.3358912,"latitude":28.5986368,"heading":227.0,"speed":36.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":193.0,"powerSupplyVoltage":14423.0,"power":1,"gsmlevel":3,"gpsSpeed":36.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:42:55","greenDriveTypeStr":"-"},{"id":467500126,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"60, Narmada Marg, Block L, Sector 11, Noida, Uttar Pradesh. 13 m from Mapgra Industry Ltd pin-201301","timestamp":1483243991,"insertTime":1483244015,"longitude":77.3343232,"latitude":28.5974656,"heading":231.0,"speed":51.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":191.0,"powerSupplyVoltage":14432.0,"power":1,"gsmlevel":3,"gpsSpeed":51.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:43:11","greenDriveTypeStr":"-"},{"id":467500124,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"48, Narmada Marg, Block K, Sector 11, Noida, Uttar Pradesh. 31 m from Overhead Tank pin-201301","timestamp":1483244009,"insertTime":1483244015,"longitude":77.3327232,"latitude":28.5963008,"heading":229.0,"speed":8.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":191.0,"powerSupplyVoltage":14633.0,"power":1,"gsmlevel":3,"gpsSpeed":8.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:43:29","greenDriveTypeStr":"-"},{"id":467502068,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"65, Narmada Marg, Block H, Sector 11, Noida, Uttar Pradesh. 45 m from Havells pin-201301","timestamp":1483244031,"insertTime":1483244054,"longitude":77.3316032,"latitude":28.5955072,"heading":263.0,"speed":11.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":194.0,"powerSupplyVoltage":14270.0,"power":1,"gsmlevel":4,"gpsSpeed":11.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:43:51","greenDriveTypeStr":"-"},{"id":467502067,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"65, Noida Road, Block H, Sector 11, Noida, Uttar Pradesh. 36 m from Havells pin-201301","timestamp":1483244038,"insertTime":1483244054,"longitude":77.3314752,"latitude":28.5955264,"heading":293.0,"speed":9.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":192.0,"powerSupplyVoltage":14442.0,"power":1,"gsmlevel":4,"gpsSpeed":9.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:43:58","greenDriveTypeStr":"-"},{"id":467502066,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"Chaudhary Restaurant, Jhundpura, Sector 11, Noida, Uttar Pradesh. 10 m from Noida Sector 11 Bus Stop pin-201301","timestamp":1483244050,"insertTime":1483244054,"longitude":77.3308032,"latitude":28.5961824,"heading":323.0,"speed":38.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":193.0,"powerSupplyVoltage":14384.0,"power":1,"gsmlevel":4,"gpsSpeed":38.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:44:10","greenDriveTypeStr":"-"},{"id":467503976,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"1, Noida Road, Block F, Sector 11, Noida, Uttar Pradesh. 15 m from WiFi Network Solution pin-201301","timestamp":1483244071,"insertTime":1483244093,"longitude":77.3294912,"latitude":28.5975712,"heading":320.0,"speed":34.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":198.0,"powerSupplyVoltage":14413.0,"power":1,"gsmlevel":5,"gpsSpeed":34.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:44:31","greenDriveTypeStr":"-"},{"id":467503975,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"1, Udyog Marg, Block F, Sector 11, Noida, Uttar Pradesh. 16 m from WiFi Network Solution pin-201301","timestamp":1483244076,"insertTime":1483244093,"longitude":77.3292608,"latitude":28.5977504,"heading":281.0,"speed":13.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":197.0,"powerSupplyVoltage":14604.0,"power":1,"gsmlevel":5,"gpsSpeed":13.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:44:36","greenDriveTypeStr":"-"},{"id":467503974,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"1, Udyog Marg, Block F, Sector 11, Noida, Uttar Pradesh. 19 m from WiFi Network Solution pin-201301","timestamp":1483244078,"insertTime":1483244093,"longitude":77.3292096,"latitude":28.5977088,"heading":235.0,"speed":13.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":196.0,"powerSupplyVoltage":14461.0,"power":1,"gsmlevel":5,"gpsSpeed":13.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:44:38","greenDriveTypeStr":"-"},{"id":467504164,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"23, Block E, Sector 8, Noida, Uttar Pradesh. 7 m from Onlive Infotech pin-201301","timestamp":1483244093,"insertTime":1483244097,"longitude":77.328416,"latitude":28.597184,"heading":265.0,"speed":17.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":196.0,"powerSupplyVoltage":14499.0,"power":1,"gsmlevel":5,"gpsSpeed":17.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:44:53","greenDriveTypeStr":"-"},{"id":467504163,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"23, Block E, Sector 8, Noida, Uttar Pradesh. 7 m from Onlive Infotech pin-201301","timestamp":1483244094,"insertTime":1483244097,"longitude":77.3283712,"latitude":28.5972096,"heading":296.0,"speed":19.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":194.0,"powerSupplyVoltage":14442.0,"power":1,"gsmlevel":5,"gpsSpeed":19.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:44:54","greenDriveTypeStr":"-"},{"id":467506093,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"52, Block E, Sector 8, Noida, Uttar Pradesh. 17 m from Leather Packaging pin-201301","timestamp":1483244113,"insertTime":1483244136,"longitude":77.327008,"latitude":28.5984064,"heading":258.0,"speed":23.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":195.0,"powerSupplyVoltage":14576.0,"power":1,"gsmlevel":3,"gpsSpeed":23.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:45:13","greenDriveTypeStr":"-"},{"id":467506090,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"54, Block E, Sector 8, Noida, Uttar Pradesh. 49 m from Leather Packaging pin-201301","timestamp":1483244119,"insertTime":1483244136,"longitude":77.3265152,"latitude":28.5980768,"heading":228.0,"speed":40.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":194.0,"powerSupplyVoltage":14442.0,"power":1,"gsmlevel":3,"gpsSpeed":40.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:45:19","greenDriveTypeStr":"-"},{"id":467506418,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"47, Block F, Sector 8, Noida, Uttar Pradesh. 16 m from Tirupati Ice Factory pin-201301","timestamp":1483244135,"insertTime":1483244142,"longitude":77.3248832,"latitude":28.5968512,"heading":229.0,"speed":54.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":190.0,"powerSupplyVoltage":14394.0,"power":1,"gsmlevel":3,"gpsSpeed":54.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:45:35","greenDriveTypeStr":"-"},{"id":467508199,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"30, Block F, Sector 8, Noida, Uttar Pradesh. 27 m from Gannon Drunkenly Company pin-201301","timestamp":1483244150,"insertTime":1483244180,"longitude":77.3232896,"latitude":28.595664,"heading":230.0,"speed":46.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":195.0,"powerSupplyVoltage":14423.0,"power":1,"gsmlevel":3,"gpsSpeed":46.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:45:50","greenDriveTypeStr":"-"},{"id":467508198,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"1, Block F, Sector 8, Noida, Uttar Pradesh. 21 m from HCL Carrier Development Centre pin-201301","timestamp":1483244161,"insertTime":1483244180,"longitude":77.3224256,"latitude":28.5950752,"heading":264.0,"speed":22.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":194.0,"powerSupplyVoltage":14490.0,"power":1,"gsmlevel":3,"gpsSpeed":22.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:46:01","greenDriveTypeStr":"-"},{"id":467508197,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"1, Dharamshila Hospital Road, Block F, Sector 8, Noida, Uttar Pradesh. 27 m from HCL Carrier Development Centre pin-201301","timestamp":1483244163,"insertTime":1483244180,"longitude":77.3222784,"latitude":28.5951104,"heading":300.0,"speed":26.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":194.0,"powerSupplyVoltage":14461.0,"power":1,"gsmlevel":3,"gpsSpeed":26.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:46:03","greenDriveTypeStr":"-"},{"id":467508433,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"10, Dharamshila Hospital Road, Block G, Sector 6, Noida, Uttar Pradesh. 0 m from Front Line Pvt Ltd pin-201301","timestamp":1483244180,"insertTime":1483244184,"longitude":77.3210176,"latitude":28.5965408,"heading":322.0,"speed":33.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":198.0,"powerSupplyVoltage":14471.0,"power":1,"gsmlevel":3,"gpsSpeed":33.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:46:20","greenDriveTypeStr":"-"},{"id":467508432,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"10, Block G, Sector 6, Noida, Uttar Pradesh. 23 m from Front Line Pvt Ltd pin-201301","timestamp":1483244183,"insertTime":1483244184,"longitude":77.3208384,"latitude":28.5966432,"heading":280.0,"speed":25.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":195.0,"powerSupplyVoltage":14576.0,"power":1,"gsmlevel":3,"gpsSpeed":25.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:46:23","greenDriveTypeStr":"-"},{"id":467508643,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"19, Block C, Sector 7, Noida, Uttar Pradesh. 28 m from Bureau Veritas Consumer Product Services Pvt Ltd pin-201301","timestamp":1483244185,"insertTime":1483244188,"longitude":77.3207104,"latitude":28.596592,"heading":241.0,"speed":27.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":194.0,"powerSupplyVoltage":14538.0,"power":1,"gsmlevel":3,"gpsSpeed":27.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:46:25","greenDriveTypeStr":"-"},{"id":467510506,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"21, Block C, Sector 6, Noida, Uttar Pradesh. 17 m from BR Seth and Company pin-201301","timestamp":1483244201,"insertTime":1483244226,"longitude":77.3189952,"latitude":28.595536,"heading":235.0,"speed":54.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":196.0,"powerSupplyVoltage":14423.0,"power":1,"gsmlevel":4,"gpsSpeed":54.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:46:41","greenDriveTypeStr":"-"},{"id":467510504,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"10, Block B, Sector 7, Noida, Uttar Pradesh. 15 m from Paras Rampuria International pin-201301","timestamp":1483244214,"insertTime":1483244226,"longitude":77.3171968,"latitude":28.5944544,"heading":236.0,"speed":52.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":196.0,"powerSupplyVoltage":14432.0,"power":1,"gsmlevel":4,"gpsSpeed":52.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:46:54","greenDriveTypeStr":"-"},{"id":467510703,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"1, Block B, Sector 7, Noida, Uttar Pradesh. 27 m from Trinity Group pin-201301","timestamp":1483244227,"insertTime":1483244230,"longitude":77.3157376,"latitude":28.5936384,"heading":284.0,"speed":21.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":202.0,"powerSupplyVoltage":14365.0,"power":1,"gsmlevel":4,"gpsSpeed":21.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:47:07","greenDriveTypeStr":"-"},{"id":467510702,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"16, Block A, Sector 7, Noida, Uttar Pradesh. 20 m from Protocol Surveyors and Engineering Pvt Ltd pin-201301","timestamp":1483244229,"insertTime":1483244230,"longitude":77.3156416,"latitude":28.5937312,"heading":318.0,"speed":24.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":203.0,"powerSupplyVoltage":14461.0,"power":1,"gsmlevel":4,"gpsSpeed":24.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:47:09","greenDriveTypeStr":"-"},{"id":467512434,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"17, Block A, Sector 7, Noida, Uttar Pradesh. 35 m from Jay K Pvt Ltd pin-201301","timestamp":1483244238,"insertTime":1483244266,"longitude":77.315168,"latitude":28.5941632,"heading":282.0,"speed":15.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":200.0,"powerSupplyVoltage":14327.0,"power":1,"gsmlevel":4,"gpsSpeed":15.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:47:18","greenDriveTypeStr":"-"},{"id":467512433,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"18, Block A, Sector 7, Noida, Uttar Pradesh. 40 m from Shree Bharat International Pvt Ltd pin-201301","timestamp":1483244240,"insertTime":1483244266,"longitude":77.3150848,"latitude":28.5941152,"heading":238.0,"speed":19.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":197.0,"powerSupplyVoltage":14432.0,"power":1,"gsmlevel":5,"gpsSpeed":19.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:47:20","greenDriveTypeStr":"-"},{"id":467512430,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"29, Block A, Sector 7, Noida, Uttar Pradesh. 11 m from Studio Brahma pin-201301","timestamp":1483244254,"insertTime":1483244266,"longitude":77.31424,"latitude":28.59368,"heading":286.0,"speed":10.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":200.0,"powerSupplyVoltage":14260.0,"power":1,"gsmlevel":5,"gpsSpeed":10.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:47:34","greenDriveTypeStr":"-"},{"id":467512429,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"29, Block A, Sector 7, Noida, Uttar Pradesh. 11 m from Studio Brahma pin-201301","timestamp":1483244256,"insertTime":1483244266,"longitude":77.3142016,"latitude":28.5937152,"heading":319.0,"speed":20.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":201.0,"powerSupplyVoltage":14461.0,"power":1,"gsmlevel":5,"gpsSpeed":20.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:47:36","greenDriveTypeStr":"-"},{"id":467514426,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"171, Block E, Sector 7, Noida, Uttar Pradesh. 20 m from Ganapati Garments pin-201301","timestamp":1483244293,"insertTime":1483244305,"longitude":77.3129472,"latitude":28.5951872,"heading":326.0,"speed":14.0,"hdop":0.0,"numberOfSatellites":10,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":201.0,"powerSupplyVoltage":14538.0,"power":1,"gsmlevel":4,"gpsSpeed":14.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"moving","currentEntityId":352,"durationStr":"-","movementStatusStr":"Moving","timestampStr":"01-01-2017 09:48:13","greenDriveTypeStr":"-"},{"id":467514425,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"171, Block E, Sector 7, Noida, Uttar Pradesh. 15 m from Ganapati Garments pin-201301","timestamp":1483244301,"insertTime":1483244305,"longitude":77.3128064,"latitude":28.5952736,"heading":242.0,"speed":6.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":1,"digitalInput2":0,"digitalInput3":0,"altitude":201.0,"powerSupplyVoltage":14547.0,"power":1,"gsmlevel":4,"gpsSpeed":6.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"idle","currentEntityId":352,"durationStr":"-","movementStatusStr":"Idle","timestampStr":"01-01-2017 09:48:21","greenDriveTypeStr":"-"},{"id":467529511,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"173, Block E, Sector 7, Noida, Uttar Pradesh. 11 m from Ganapati Garments pin-201301","timestamp":1483244602,"insertTime":1483244612,"longitude":77.3126784,"latitude":28.5950816,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":190.0,"powerSupplyVoltage":12797.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 09:53:22","greenDriveTypeStr":"-"},{"id":467544955,"accountId":214,"deviceId":352,"entityId":[352],"uniqueId":"356307042671502","address":"173, Block E, Sector 7, Noida, Uttar Pradesh. 11 m from Ganapati Garments pin-201301","timestamp":1483244903,"insertTime":1483244914,"longitude":77.3126784,"latitude":28.5950816,"heading":0.0,"speed":0.0,"hdop":0.0,"numberOfSatellites":9,"digitalInput1":0,"digitalInput2":0,"digitalInput3":0,"altitude":219.0,"powerSupplyVoltage":12548.0,"power":1,"gsmlevel":4,"gpsSpeed":0.0,"valid":true,"gpsFix":false,"indianBox":false,"validGPS":false,"accOff":false,"type":1,"processFlags":{"history":false},"movementStatus":"stopped","currentEntityId":352,"durationStr":"-","movementStatusStr":"Stopped","timestampStr":"01-01-2017 09:58:23","greenDriveTypeStr":"-"}],"distancekm":5.88,"message":"success","status":200}';
						//response = JSON.parse(response);
					var events = response.data;
					var latlngs = [];
					for(var index in events){
						var latlng = [];
						latlng.push(events[index].latitude);
						latlng.push(events[index].longitude);
						latlngs.push(latlng);
					}
					var polyoptions = {
							 color: 'green',
				             dashArray: '20,15',
				             lineJoin: 'round'
					}
					actualRoutePolyline = L.polyline(latlngs,polyoptions);
					map.addLayer(actualRoutePolyline);
					var routeAssign = routeAssignDetailsObj[options.assignId];
					var assignments = routeAssign.assignments;
					for(var index in assignments){
						if(assignments[index].actualTime !== null && assignments[index].actualTime !== undefined){
							$("div[markerpointid="+assignments[index].geofenceId+"]").find('i').css("color","green");
						}
					}
					
				}
			else{
				alert(response.message);
			}	
			
			}
	}
	
	
	/**
	 * @name el
	 * @desc properties and functions used to modify dom
	 */
	var el={
			routeListItemContainer:$("#customroutelistcontainer"),
			routeItemContainer:$("#routepoints"),
			routeItem:' <div class="routepoint">'+
			'<i class="fa fa-times deleteroutepoint pointer" title="delete point" aria-hidden="true"></i>'
			+'<div class="form-group">'
			+'<label class="col-sm-3">Name: '
			+'<br/><span class="pointposition" style="text-align: center;font-size: 10px;font-weight: bold;"></span>'
			+'</label>'
			+'<div class="col-sm-9">'
			+'<input type="text" class="form-control txtpointname" id="pointname" value=""/>'
			+'<input class="isSchool" type="checkbox"><label for="isSchool">&nbsp;Mark as School<label>'
			+'</div>'
			+'</div>'
			+'<div class="form-group">'
			+'<label class="col-sm-3">Address: </label>'
			+'<div class="col-sm-9">'
			+'<input type="text" disabled="disabled" class="form-control txtpointaddress" value="waiting for address.."/>'
			+'</div>'
			+'</div>'
			+'<div class="form-group" style="display:none;">'
			+'<label class="control-label col-sm-3">lat,lan: </label>'
			+'<div class="col-sm-9">'
			+'<input type="text" disabled="disabled" class="form-control txtlatlng" value=""/>'
			+'</div>'
			+'</div>'
			+'<div class="form-group">'
			+'<label class="col-sm-3">Buffer(m): </label>'
			+'<div class="col-sm-9">'
			+'<input type="text" class="form-control txtbuffer backwhitecolor" value="50"/>'
			+'</div>'
			+'</div>'
			+'<div class="form-group txtroutepointtypecontainer" style="display:none;">'
			+'<label class="col-sm-3">Type: </label>'
			+'<div class="col-sm-9">'
			+'<select data-placeholder="Please select" style="width:100%;" class="txtroutepointtype">'
			+'<option value="">Please select</option>'
			+'<option value="0">Entry</option>'
			+'<option value="1">Exit</option>'
			+'</select>'
			+'</div>'
			+'</div>'
			+'<div class="form-group">'
			+'<label class="control-label col-sm-3">Distance(km): </label>'
			+'<div class="col-sm-9">'
			+'<label class="control-label col-sm-2 txtroutepointdistance"></label>'
			+'</div>'
			+'</div>'
			+'<div class="form-group">'
			+'<label class="control-label col-sm-3">Time(hh:mm): </label>'
			+'<div class="col-sm-9">'
			+'<label class="control-label col-sm-2 txtroutepointtime"></label>'
			+'</div>'
			+'</div>'
			+'</div>',
			routeAssignPointsContainer:$(".crulassignments"),
			
			displayRouteList:function()
			{
				var strRouteListItem = "";
				for(var routeId in routeListDetailsObj)
					{
					var strRouteItem = '<div style="margin-bottom: 5px;" class="panel panel-default routeitem" style="position:relative" routeid='+routeId+'>'
						+'<div class="editdeleteroute"><i class="fa fa-edit editroute" aria-hidden="true"></i><i class="fa fa-trash-o deleteroute" aria-hidden="true"></i></div>'
						+'<div class="panel-heading">'
						+'<h4 class="panel-title">'
						+'<a data-toggle="collapse" data-parent="#customroutelistcontainer" aria-expanded="false" href="#collapse'+routeId+'">'+'('+routeId+')&nbsp;'+routeListDetailsObj[routeId].name+'</a>'
						+'</h4>'
						+'</div>'
						+'<div id="collapse'+routeId+'" class="panel-collapse collapse">'
						+'<div class="panel-body">'
						+'<ul class="list-group">';
						var routePoints = "";
						var points = routeListDetailsObj[routeId].points;
						var geozones = routeListDetailsObj[routeId].geozones;
						var index = 0;
						for(var id in points)
							{
							routePoints+='<li>'
							+'<ul class="list-group-item" routepointid='+points[id].geozoneId+'>'
							+'<li><b>Address:('+points[id].geozoneId+')</b> <label>'+points[id].address+'</label></li>'
							+'<li><b>Buffer(m):</b> <label>'+geozones[index].buffer+'</label></li>'
							+'<li><b>Distance(km): </b> <label>'+(points[id].distance/1000).toFixed(2)+'</label></li>'
							+'</ul>'
							+'</li>';
							index ++;
							}
						strRouteItem +=routePoints;
	
						strRouteItem += '</ul>'
						+'</div>'
						+'</div>'
						+'</div>';
					strRouteListItem += strRouteItem;
					}
				el.routeListItemContainer.html(strRouteListItem);
			},
			addItem:function(id,geofenceid){
				var item = $(this.routeItem).attr('routepointid',id).attr("routeid",routeId).attr("flag","I").attr("geofenceid",geofenceid);
				this.routeItemContainer.append(item);
				
				var pointslength = $('.routepoint').length;
				$('.routepoint').find(".pointposition").text("");
				$('.routepoint:eq(0)').find(".pointposition").text("Start Point");
				if(pointslength>1){
					$('.routepoint:eq('+(pointslength-1)+')').find(".pointposition").text("End Point");
				}
				if(geofenceid != undefined){
					var geofence = myproject.callBack.userroutepointsobj[geofenceid];
					$(item).find(".txtpointname").val(geofence.name);
					$(item).find(".txtpointname").attr("disabled",true);
					$(item).find(".txtbuffer").val(geofence.buffer != undefined ? geofence.buffer : geofence.type== 'Point' ? '100' : '');
					$(item).find(".txtbuffer").attr("disabled",true);
				}else{
					$(item).find(".txtpointname").val("Route point "+id);
				}
				$(".txtroutepointtype").select2({
					minimumResultsForSearch: -1
				});
				if($("#routetype").val()==2){
					$(".txtroutepointtypecontainer").removeAttr("style");
					$(".txtroutepointtypecontainer").show();
				}else{
					$(".txtroutepointtypecontainer").hide();
				}
			},
			removeItem:function(id){
				var elem = this.routeItemContainer.find('div[routepointid='+id+'][routeid='+routeId+']');
				if(elem.attr("flag") == "E"){
					elem.attr("flag","ED");
					elem.hide();
					var pointslength = $('.routepoint').length;
					var counter = 0;
					$('.routepoint').find(".pointposition").text("");
					for(var i=0;i<pointslength;i++){
						var element = $('.routepoint:eq('+i+')');
						if(counter=='0' && $(element).is(":visible")){
							$(element).find(".pointposition").text("Start Point");
						}else if(i==(pointslength-1)){
							if($(element).is(":visible")){
								$(element).find(".pointposition").text("End Point");
							}else{
								for(var j=pointslength;j>0;j--){
									var lstelement = $('.routepoint:eq('+j+')');
									if($(lstelement).is(":visible")){
										$(lstelement).find(".pointposition").text("End Point");
										break;
									}
								}
							}
						}
						if($(element).find(".txtpointname").val().indexOf('Route point') == 0 && $(element).is(":visible")){
							$(element).find(".txtpointname").val("Route point "+(counter+1));
							$(element).find(".txtpointname").attr("value","Route point "+(counter+1));
							$(element).attr("routepointname","Route point "+(counter+1));
							if(element.attr("flag") == "E"){
								element.attr("flag","EU");
							}
							counter++;
						}
					}
				}else{
					elem.remove();	
					var pointslength = $('.routepoint').length;
					for(var i=0;i<pointslength;i++){
						if($('.routepoint:eq('+i+')').find(".txtpointname").val().indexOf('Route point') == 0){
							$('.routepoint:eq('+i+')').find(".txtpointname").val("Route point "+(i+1));
						}
					}
					$('.routepoint').find(".pointposition").text("");
					$('.routepoint:eq(0)').find(".pointposition").text("Start Point");
					if(pointslength>1){
						$('.routepoint:eq('+(pointslength-1)+')').find(".pointposition").text("End Point");
					}
				}
			},
			updateMarkerSequence:function(){
				$(".routepoint").each(function(index){
					var seq = index + 1;
					var routePointId = $(this).attr("routepointid");
					$("div[markerpointid="+routePointId+"]").find("span").text(seq);
					
				});
			},
			hideBtnCreateCustomRoute:function(){
				$("#btncreatecustomroute").hide();
			},
			showBtnCreateCustomRoute:function(){
				$("#btncreatecustomroute").show();
			},
			hideRouteCreationContainer:function(){
				$("#customroutecreationcontainer").hide();
				$("#dailyrouteassign").prop("checked",false);
				$("#dailyrouteassigntimediv").hide();
			},
			showRouteCreationContainer:function(){
				$("#customroutecreationcontainer").show();
			},
			updateRouteElements:function(arrTime,arrDistance,duration_in_traffic){
				var totalDistance = 0,totalTime = 0;
				for(var index in arrTime){
					totalTime += arrTime[index];
				}
				for(var index in arrDistance){
					totalDistance += arrDistance[index];
				}
				$("#routepoints").find(".routepoint:visible").each(function(index){
					if(index == 0){
						$(this).find(".txtroutepointdistance").text("0.00");
						$(this).find(".txtroutepointdistance").attr("routepointdistance","0.00");
						$(this).find(".txtroutepointtime").text("00:00");
						$(this).find(".txtroutepointtime").attr("routepointtime","0");
					}else{
						$(this).find(".txtroutepointdistance").text(" "+(arrDistance[index-1]/1000).toFixed(2));
						$(this).find(".txtroutepointdistance").attr("routepointdistance",arrDistance[index-1]);
						$(this).find(".txtroutepointtime").text(Util.getSecondsToHHMM(arrTime[index-1]));
						$(this).find(".txtroutepointtime").attr("routepointtime",arrTime[index-1]);
					}
					
				});
				$("#txtroutetotaldistance").attr("routetotaldistance",totalDistance);
				totalDistance = totalDistance/1000;
				totalDistance = totalDistance.toFixed(2);
				$("#txtroutetotaldistance").text(totalDistance);
				$("#txtroutetotaltime").text(Util.getSecondsToHHMM(totalTime));
				$("#txtduration_in_traffic").text(duration_in_traffic);
				$("#txtroutetotaltime").attr("routetotaltime",totalTime);
			},
			hideRouteListItemContainer:function(){
				el.routeListItemContainer.hide();
				$("#searchcustomroutelist").hide();
			},
			showRouteListItemContainer:function(){
				el.routeListItemContainer.show();
				$("#searchcustomroutelist").show();
			},
			validateRoutePoints:function(){
				var flag = true;
				$("#routepoints").find(".routepoint").each(function(){
					if($(this).attr("geofenceid") == undefined){
						var buffer = $.trim($(this).find(".txtbuffer").val());
						if(!$.isNumeric(buffer) || buffer > 250){
							flag = false;
							return false;
						}
					}
				});
				return flag;
			},
			validateRouteForm:function(){
				var count = 1;
				var routeName = $.trim($("#txtroutename").val());
				if(routeName.length == 0 || routeName.length>50){
					alert("Route name is mandatory and length can't be greather than 50.");
					count = 0;
				}else if(!getValidateRouteSubmitFlag()){
					alert("Please complete route.");
					count = 0;
				}else if(!el.validateRoutePoints()){
					alert("Route point buffer can't be greater than 250.");
					count = 0;
				}
				return count;
			},
			validateRouteAssignForm:function(){
				var	count = 1;
				var routeId = $("#crslcroute").val();
				var entityId = $("#crslcentity").val();
//				var startTime = $.trim($("#crstarttime").find("input").val());
//				var endTime = $.trim($("#crendtime").find("input").val());
				if(routeId == "" || routeId == undefined){
					alert("Please select route.");
					count = 0;
				}
				else if(entityId == "" || entityId == undefined){
					alert("Please select entity.");
					count = 0;
				}
//				else if(startTime == "" || Util.dateToTimestampInSecond(startTime) == ""){
//					alert("Please select start Time.");
//					count = 0;
//				}
//				else if(endTime == "" || Util.dateToTimestampInSecond(endTime) == ""){
//					alert("Please select end Time.");
//					count = 0;
//				}
				return count;
					
			},
			restRouteCreationForm:function(){
				$("#txtroutename").val("")
				$("#txtroutetotaldistance").text("-");
				$("#txtroutetotaltime").text("-");
				$("#txtduration_in_traffic").text("-");
				el.routeItemContainer.html("");
			},
			editRoute:function(){
				var routeData = routeListDetailsObj[routeId];
				$("#txtroutename").val(routeData.name);
				$("#routetype").val(routeData.type).trigger("change");
				$("#routeTypeOption").val(routeData.routeType).trigger("change");
				var display = "";
				if(routeData.type!='2'){
					display ="display:none;";
				}
				var totalDistance = "";
				if(routeData.totalDistance !== undefined){
					totalDistance = routeData.totalDistance/1000;
					totalDistance = totalDistance.toFixed(2);
				}
				$("#txtroutetotaldistance").text(totalDistance);
				$("#txtroutetotaldistance").attr("routetotaldistance",routeData.totalDistance);
				$("#txtroutetotaltime").text(Util.getSecondsToHHMM(routeData.totalTime));
				$("#txtroutetotaltime").attr("routetotaltime",routeData.totalTime);
				$("#txtduration_in_traffic").text("");
				
				var dailyRouteAssignment = routeData.dailyRouteAssignment;
				if(dailyRouteAssignment != undefined){
					$("#dailyrouteassign").trigger("click");
					
					var starttime = dailyRouteAssignment.startTime;
				    var h = Math.floor(starttime / 3600);
				    var m = Math.floor(starttime % 3600 / 60);
				    
				    var meridian  = "AM";
					if(h>12){
						meridian  = "PM";
					}
				    var timeString = h+":"+m+" "+meridian;
					$('#crstarttime').timepicker('setTime', timeString);
				    
					var endtime = dailyRouteAssignment.endTime;
				    var h = Math.floor(endtime / 3600);
				    var m = Math.floor(endtime % 3600 / 60);
				    
				    var meridian  = "AM";
					if(h>12){
						meridian  = "PM";
					}
				    var timeString = h+":"+m+" "+meridian;
					$('#crendtime').timepicker('setTime', timeString);
					
					if(dailyRouteAssignment.entityId != null && dailyRouteAssignment.entityId.length>0){
						var entities = dailyRouteAssignment.entityId;
						/*if(myproject.callBack.userentityobj.length==entities.length){
							$("#AddAllDevice").click();
						}else{*/
							for(var i in entities){
								$("#dailyrouteassinmententity > option[value="+entities[i]+"]").prop("selected","selected");
								$("#dailyrouteassinmententity").trigger("change");
							}
						//}
					}
				}
				
				var points = routeData.points;
				var geozones = routeData.geozones;
				var index = 0;
				var strRoutePoints = "";
				var noSchoolMark = true;
				for(var id in points){
					var selectedEntry = "";
					var selectedExit = "";
					if(points[id].type=='0'){
						selectedEntry = "selected";
					}else if(points[id].type=='1'){
						selectedExit = "selected";
					}
					var checked = "";
					var labelshow = "";
					for(var key in geozones){
						var isSchoolMark = geozones[key].isSchool;
						if(geozones[key].id===points[id].geozoneId){
							if((isSchoolMark != undefined || isSchoolMark != 'undefined') && isSchoolMark){
								checked = 'checked';
								noSchoolMark = false;
							}else{
								checked = 'style="display:none"';
								labelshow = 'style="display:none"';
							}
							break;
						}
					}
					
					strRoutePoints += ' <div class="routepoint" routepointid='+points[id].geozoneId+' routepointname="'+geozones[index].name+'" routeid='+routeId+' flag="E">'+
					'<i class="fa fa-times deleteroutepoint pointer" title="delete point" aria-hidden="true"></i>'
					+'<div class="form-group">'
					+'<label class="col-sm-3">Name: '
					+'<br/><span class="pointposition" style="text-align: center;font-size: 10px;font-weight: bold;"></span>'	
					+'</label>'
					+'<div class="col-sm-9">'
					+'<input type="text" class="form-control txtpointname" id="pointname" value="'+geozones[index].name+'"/>'
					+'<input class="isSchool" type="checkbox" '+checked+'><label for="isSchool"'+labelshow+'>&nbsp;Mark as School<label>'
					+'</div>'
					+'</div>'
					+'<div class="form-group">'
					+'<label class="col-sm-3">Address: </label>'
					+'<div class="col-sm-9">'
					+'<input type="text" disabled="disabled" class="form-control txtpointaddress" value="'+points[id].address+'"/>'
					+'</div>'
					+'</div>'
					+'<div class="form-group" style="display:none">'
					+'<label class="control-label col-sm-3">lat,lan: </label>'
					+'<div class="col-sm-9">'
					+'<input type="text" disabled="disabled" class="form-control txtlatlng" value="'+geozones[index].geometry.coordinates[1]+','+geozones[index].geometry.coordinates[0]+'"/>'
					+'</div>'
					+'</div>'
					+'<div class="form-group">'
					+'<label class="col-sm-3">Buffer(m): </label>'
					+'<div class="col-sm-9">'
					+'<input type="text" class="form-control txtbuffer backwhitecolor" value="'+geozones[index].buffer+'"/>'
					+'</div>'
					+'</div>'
					+'<div class="form-group txtroutepointtypecontainer" style="'+display+'">'
					+'<label class="col-sm-3">Type: </label>'
					+'<div class="col-sm-9">'
					+'<select data-placeholder="Please select" style="width:100%;" class="txtroutepointtype">'
					+'<option value="">Please select</option>'
					+'<option value="0" '+selectedEntry+'>Entry</option>'
					+'<option value="1" '+selectedExit+'>Exit</option>'
					+'</select>'
					+'</div>'
					+'</div>'
					+'<div class="form-group">'
					+'<label class="control-label col-sm-3">Distance(km): </label>'
					+'<div class="col-sm-9">'
					+'<label class="control-label col-sm-2 txtroutepointdistance" routepointdistance='+points[id].distance+'>' +(points[id].distance/1000).toFixed(2)+'</label>'
					+'</div>'
					+'</div>'
					+'<div class="form-group">'
					+'<label class="control-label col-sm-3">Time(hh:mm): </label>'
					+'<div class="col-sm-9">'
					+'<label class="control-label col-sm-2 txtroutepointtime" routepointtime='+points[id].time+'>'+Util.getSecondsToHHMM(points[id].time)+'</label>'
					+'</div>'
					+'</div>'
					+'</div>';
					
					//$("#txtroutepointtype").val(points[id].type).trigger("change");
					createMarker([geozones[index].geometry.coordinates[1],geozones[index].geometry.coordinates[0]],points[id].geozoneId);
					
					index ++;
				}
				el.routeItemContainer.html(strRoutePoints);
				if(noSchoolMark){
					$(".isSchool").show();
					$(".isSchool").next().show();
				}
				$(".txtroutepointtype").select2({
					minimumResultsForSearch: -1
				});
				var pointslength = $('.routepoint').length;
				$('.routepoint').find(".pointposition").text("");
				$('.routepoint:eq(0)').find(".pointposition").text("Start Point");
				if(pointslength>1){
					$('.routepoint:eq('+(pointslength-1)+')').find(".pointposition").text("End Point");
				}
				createPolyline(routeData.polylinePoints);
				fitBoundMap();
			},
			populateRouteList:function(){
				
					var routeList = getRouteNameList(); 
			        var lis = "<option></option>";
			        for (var id in routeList) {
			            lis = lis + '<option value='+id+'>' + routeList[id] + '</option>';          
			        }
			        $("#crslcroute").html(lis);
			        $("#crslcroute").select2({placeholder: "Please select"});
		    	
			},
			populateEntityList:function(){
				var entityList = $myproject.commons.getEntityNameList();
				if(!$("#crslcentity").children().length){
			        var lis = "<option></option>";
			        for (var id in entityList) {
			            lis = lis + '<option value='+id+'>' + entityList[id] + '</option>';          
			        }
			        $("#crslcentity").html(lis);
			        $("#crslcentity").select2({placeholder: "Please select"});
		    	}
				if(!$("#dailyrouteassinmententity").children().length){ 
			        var lis = "<option></option>";
			        for (var id in entityList) {
			            lis = lis + '<option value='+id+'>' + entityList[id] + '</option>';          
			        }
			        $("#dailyrouteassinmententity").html(lis);
			        $("#dailyrouteassinmententity").select2({placeholder: "Please select"});
		    	}
			},
			attachDatePicker:function(elem){
				elem.datetimepicker({ 
					format: 'DD-MM-YYYY HH:mm:ss'
//					,sideBySide:true
				}).on("dp.change",function(e){
					var selectedLi = $(this).closest('.routepoint');
//					alert($('.crulassignments .routepoint').index($(this).closest('.routepoint')));
					var timestamp = e.date.unix();
					var elemIndex = $('.crulassignments .routepoint').index($(this).closest('.routepoint'));
//					if(elemIndex == "0")
//						{
//							var bufferTime = selectedLi.find('.crbuffertime').val();
//							if($.trim(bufferTime) !== "" && isNaN(bufferTime))
//								{
//								timestamp = timestamp + bufferTime;
//								}
//							
//						}else{
//							var routeData = routeListDetailsObj[routeId];
//							var points = routeData.points;
//							var point = points[elemIndex+1];
//							var firstElem = $('.crulassignments .routepoint').eq(0);
//							 timestamp = Util.dateToTimestampInSecond(firstElem.find('.crplannedtime>input').val());
//							timestamp += point.time;
//						}
//					selectedLi.find(".crtime").text(Util.UnixDateTime(timestamp));
					
					if(elemIndex == "0"){
						$('.crulassignments .routepoint').each(function(i){
							var bufferTime = parseInt($(this).find('.crtimebuffer').val());
							if(i == "0")
								{
									
									if($.trim(bufferTime) !== "" && !isNaN(bufferTime))
										{
										timestamp = timestamp + bufferTime;
										}
									
								}else{
									var routeData = routeListDetailsObj[routeId];
									var points = routeData.points;
									var point = points[i+1];
									 if($.trim(bufferTime) !== "" && !isNaN(bufferTime))
										{
										timestamp = timestamp + bufferTime;
										}
									timestamp += point.time;
								}
							$(this).find(".crtime").text(Util.UnixDateTime(timestamp));  // Set ETA Value in the route assignment section
							//Added by Sumeet on 11th May 2017  (Instruct by Sachin)
							$(this).find(".crplannedtime>input").val(Util.UnixDateTime(timestamp));
						});
					}

					
				});
			},
			attachDateTimePicker:function(elem){
				return elem.datetimepicker({ 
					format: 'DD-MM-YYYY'
//					,sideBySide:true
				});
			},
			attachSelect2:function(elem){
				elem.select2({placeholder: "Please select"});
			},
			showRouteAssignmentTalbe:function(){
				$("#credit-route").show();
			}, 	
			hideRouteAssignmentTable:function(){
				$("#credit-route").hide();
			},
			routeMode:function(){
				el.hideRouteAssignmentTable();
				el.populateEntityList();
				map.off('dblclick',mapdblClickHandler);
				map.on('dblclick',mapdblClickHandler);
			},
			routeAssignMode:function(){
				el.showRouteAssignmentTalbe();
				map.off('dblclick',mapdblClickHandler);
				el.populateRouteList();
				routeAssignOperationFlag="I";
				if(getRouteAssigsFlag) //to ensure call only once when switch to routeAssiment mode first time
					{	
						el.populateEntityList();
//						el.attachDatePicker($("#crstarttime"));
//						el.attachDatePicker($("#crendtime"));
						controller.getRouteAssignList(0);
						getRouteAssigsFlag = false;
						var assignDateFilter = el.attachDateTimePicker($(".crassigndatefilter"));
						assignDateFilter.on("dp.change",function(e){
							var timestamp = e.date.unix();
							myproject.customRoute.timestamp=timestamp;
							controller.getRouteAssignList(timestamp);
						});
					}
				
			},
			displayRouteAssignPoints:function(){
				var strAssignPoints = "";
				var routeData = routeListDetailsObj[routeId];
				var points = routeData.points;
				var geozones = routeData.geozones;
				var routeType = routeData.routeType;
				/*$("#routeTypeHidden").val(routeType);*/
				var index = 0;
				for(var id in points){
					strAssignPoints += ' <li class="routepoint" routepointid='+points[id].geozoneId+'>'
					     +'<ul class="list-group-item" routepointid='+points[id].geozoneId+'>'
					     +'<li> <b>Address:</b> <label>'+points[id].address+'</label></li>'
					     +'<li style="display:none"><b>lat,lan:</b> <label>'+geozones[index].geometry.coordinates[1]+','+geozones[index].geometry.coordinates[0]+'</label></li>'
					     +'<li><b>Buffer(m):</b> <label>'+geozones[index].buffer+'</label></li>'
					     +'<li><b>Distance(km): </b> <label class="crdistance">'+(points[id].distance/1000).toFixed(2)+'</label></li>'
					     +'<li>'
					     +'<div class="form-group">'
					     +'<label class="control-label col-sm-5" style="padding-left:0px"><b>Planned Time:</b></label>'
					     +'<div class="col-sm-7">'
					     +'<div class="input-group date crplannedtime">'
					     +'<input type="text" class="form-control" /> '
					     +'<span class="input-group-addon btn btn-default">'
					     +'	<i class="i i-calendar"></i>'
					     +'</span>'
					     +'</div>'
					     +'</div>'
					     +'</div>'
					     +'</li>'
					     +'<li>'
					     +'<div class="form-group">'
					     +'<label class="control-label col-sm-5" style="padding-left:0px"><b>Buffer Time:</b></label>'
					     +'<div class="col-sm-7">'
					     +'<input type="text" class="form-control crtimebuffer"/>'
					     +'<input type="hidden" class="form-control crpointtype" value="'+points[id].type+'"/>'
					     +'</div>'
					     +'</div>'
					     +'<div class="form-group">'
					     +'<label class="control-label col-sm-5" style="padding-left:0px"><b>Planned Eta:</b></label>'
					     +'<div class="col-sm-7">'
					     +'<label class="control-label  crtime" style="padding-left:0px">-</label>'
					     +'</div>'
					     +'</div>'
					     +'</li>'
					     +'</ul>'
					     +'</li>';
					index ++;
				}
				el.routeAssignPointsContainer.html(strAssignPoints);
				el.attachDatePicker($(".crplannedtime"));
			},
			displayRouteAssignmentList:function(routeAssignments){
				
				var trs = "";
				var sNo = 1;
				var routeNames = getRouteNameList();
				var entityNames = $myproject.commons.getEntityNameList(); 
				// 0-inactive 1- active 2- completed 3- complted late 4- manually closed 5- force closed
				var status = "";
				for(var id in routeAssignments){
					 status = routeAssignments[id].status;
					 
					 var routeIcon;
					 if(status == 0){
						 routeIcon = '';
					 }else{
						 routeIcon = '<i class="fa fa-road font-awesome-margin showcractualroute pointer" aria-hidden="true" title="show route"></i>';
					 }
					 
					 switch(status){
					 case 0:
						 status = "Inactive";
						 break;
					 case 1:
						 status = "Active";
						 break;
					 case 2:
						 status = "Completed";
						 break;
					 case 3:
						 status = "Completed late";
						 break;
					 case 4:
						 status = "Manually closed";
						 break;
					 case 5:
						 status = "Force closed";
						 break;
					 }
					 
					var routeName = routeNames[routeAssignments[id].routeId];
					var entityName = entityNames[routeAssignments[id].entityId];
					var comment=routeAssignments[id].comment;
					var assignmentPointsCount = 0; 
					var routeType="-";
					if(routeAssignments[id].routeType=='1')
						routeType="Pick";
					else if(routeAssignments[id].routeType=='2')
						routeType="Drop";
					var assignments = routeAssignments[id].assignments;
					for(var index in assignments){
						assignmentPointsCount ++;
					}
					trs += '<tr routeid='+routeAssignments[id].routeId+' routeassignid='+id+' routeName="'+routeName+'" comment="'+comment+'">'
						+'<td>'+sNo+'</td>'
						+'<td><span>('+assignmentPointsCount+')</span><span class="glyphicon glyphicon-menu-right expend-croute-details pointer" titile="details"></span>'+routeIcon+''+routeAssignments[id].routeId+'</td>'
						+'<td>'+routeName+'</td>'
						+'<td>'+routeType+'</td>'
						+'<td>'+entityName+'</td>'
						+'<td>'+Util.UnixDateTime(routeAssignments[id].startTime)+'</td>'
						+'<td>'+Util.UnixDateTime(routeAssignments[id].endTime)+'</td>'
						+'<td>'+status+'</td>'
						+'<td><div class="editdeleterouteassign">';
						if(status == 'Active'){
							trs +='<a href="#" data-toggle="modal" data-target="#editcustomroutemodal" title="Mark Manual Closed"><i class="fa fa fa-lock text-success customroutemanualclosed geozoneaction"></i></a>';
							trs +='<i class="fa fa-eye editrouteassign pointer" title="view" aria-hidden="true"></i>';
							trs +='<i class="fa fa-times deleterouteassign pointer" title="delete" style="margin-left: 12px;" aria-hidden="true"></i></div></td></tr>';
						}if(status == 'Inactive'){
							trs +='<a href="#" data-toggle="modal" data-target="#editcustomroutemodal" title="Mark Manual Closed"><i class="fa fa fa-lock text-success customroutemanualclosed geozoneaction"></i></a>';
							trs +='<i class="fa fa-pencil editrouteassign pointer" title="edit" aria-hidden="true"></i>';
							trs +='<i class="fa fa-times deleterouteassign pointer" title="delete" style="margin-left: 12px;" aria-hidden="true"></i></div></td></tr>';
						}
						else{
							trs +='<i class="fa fa-eye editrouteassign pointer" title="view" aria-hidden="true"></i>';
						}
						var assignPointsTrs = "";
						var order = 1;
						for(var i=0;i<Object.keys(assignments).length;i++){
							for(var index in assignments){
								if(order===assignments[index].sequence){
									var actualTime,status,actualSequence;
									if(assignments[index].actualTime == null || assignments[index].actualTime == undefined){
										actualTime = '-';
										status = 'Pending';
										actualSequence = '-';
									}
									else{
										actualTime = Util.UnixDateTime(assignments[index].actualTime);
										status = 'Completed';
										actualSequence = assignments[index].actualSequence;
									}
									// Added by Sumeet on 11th May 2017 (Instruct by Sachin)
									var plannedTimeCompare;
									if(assignments[index].plannedTime != assignments[index].plannedEta){
										plannedTimeCompare = assignments[index].plannedTime;
									}else{
										plannedTimeCompare = assignments[index].plannedEta;
									}
															
									assignPointsTrs +='<tr style="background-color: #D6D5D5;">'
										+'<td>'+assignments[index].sequence+'</td>'
										+'<td>'+myproject.callBack.userroutepointsobj[assignments[index].geofenceId].name+'</td>'
										+'<td>'+Util.UnixDateTime(plannedTimeCompare)+'</td>'
										+'<td>'+actualTime+'</td>'
										+'<td>'+actualSequence+'</td>'
										+'<td>'+status+'</td>'
										+'</tr>';
									
									order++;
									break;
								}
							}
						}
							trs += '<tr class="crassigndetails">'
								+'<td colspan="8">'
								+'<div>'
								+'<table class="table table-striped">'
								+'<thead style="background-color: gray; color: white;">'
								+'<tr>'
								+'<th>Sequence</th>'
								+'<th>Name</th>'
								+'<th>Planned Eta</th>'
								+'<th>Actual Time</th>'
								+'<th>Actual Sequence</th>'
								+'<th>Status</th>'
								+'</tr>'
								+'</head>'
								+'<tbody>'
								+assignPointsTrs
								+'</tbody>'
								+'</table>'
								+'</div>'
								+'</td>'
								+'</tr>';
							sNo++;
					}
				$("#tblcrassignment").html(trs);
			},
			resetRouteAssignment:function(){
				routeAssignOperationFlag = "I";
				$("#crslcroute").val(null).select2({placeholder: "Please select"})
				$("#crslcentity").val(null).select2({placeholder: "Please select"})
//				$("#crstarttime input").val("");
//				$("#crendtime input").val("");
				$("#crremark").val("");
				$('.crulassignments').html("");
				removeRoute();
				el.enableRouteAssignForm();
			},
			disableRouteAssignForm:function(){
				$('.crassignmentcontainer').find(':input').prop('disabled', true);
				$('.crassignmentcontainer').prev().find(':input').prop('disabled', true);
				$("#crbtnsubmitassignment").attr('disabled',true);
				disableRoutePoints();
			},
			enableRouteAssignForm:function(){
				$('.crassignmentcontainer').find(':input').prop('disabled', false);
				$('.crassignmentcontainer').prev().find(':input').prop('disabled', false);
				$("#crbtnsubmitassignment").attr('disabled',false);
				disableRoutePoints();
			}
	}
	/////////////////////// start map event handlers// ///////////////////////////////////////////////////////
	function mapdblClickHandler(e){
		if(customRouteOperation.operationMode !== ""){
			var id = generateUniqueId();
			createMarker(e.latlng,id);
			updateAddress(e.latlng,id);
			el.addItem(id);
			el.updateMarkerSequence();
		}else{
			alert("Please click on the create custom route button to create new route.");
		}
	}
	
	function markerDbclickHandler(e){
			removeRoutePoint(this.routePointId);
			
	}
	function markerDragendHandler(e){
		updateRouteRequestData();
		updateAddress(e.target._latlng,this.routePointId);
		var elem = el.routeItemContainer.find('div[routepointid='+this.routePointId+'][routeid='+this.routeId+']');
		if(elem.attr("flag") == "E"){
			elem.attr("flag","EU");
		}
	}
	

	/////////////////////// start dom events // /////////////////////////////////////////////////////////////
	$(document).on("click","#customroutebtn",function(){
		init();
		$("#routetype").select2({
			minimumResultsForSearch: -1
		});
		$myproject.commons.getroutepoints('routepointslist',false);
		$("#routepointslist").select2({});
		$("#routeTypeOption").select2({
			placeholder: "Please select",
			minimumResultsForSearch: -1
		});
	});
	
	$("#btncreatecustomroute").click(function(){
		el.restRouteCreationForm();
		customRouteOperation["operationMode"] = "I";
		customRouteOperation["routeId"] = generateRouteId();
		routeId = customRouteOperation.routeId;
		el.showRouteCreationContainer();
		el.hideRouteListItemContainer();
		el.hideBtnCreateCustomRoute();
		
	});
	
	$("#btncalculateroute").click(calculateRoute);
	
	$(document).off("click",".deleteroutepoint");
	$(document).on("click",".deleteroutepoint",function(){
			var id = $(this).parent().attr("routepointid");
			removeRoutePoint(id);
			
	});
	
	$("#btncancelroute").click(function(){
		resetCustomRoute();
	});
	
	$("#btnsubmitroute").click(function(){
		if(el.validateRouteForm()){
			var operationMode = getOperationMode();
			if($("#routetype").val()==null 
					|| $("#routetype").val()==undefined 
					|| $("#routetype").val()==''){
				$("#routetype").val("0").trigger("change");
			}
			var route = {};
			route.token = token;
			route.accountId = accountId;
			route.name = $.trim($("#txtroutename").val());
			route.totalDistance = $.trim($("#txtroutetotaldistance").attr("routetotaldistance"));
			route.totalTime = $.trim($("#txtroutetotaltime").attr("routetotaltime"));
			route.type = $.trim($("#routetype").val());
			route.routeType = $.trim($("#routeTypeOption").val());
//			route.expiry = $("#txtrouteexpirt").val();
			var arrGeozones = [];
			$("#routepoints").find(".routepoint").each(function(index){
			var geozone = {};
			geozone.name = $(this).find(".txtpointname").val();
			var flag = $(this).attr("flag");
			if(operationMode == "U"){
				geozone.id = $(this).attr("routepointid");
				geozone.name = $(this).attr("routepointname");
				
				if(flag == "EU"){
					geozone.flag = "U";
				}else if(flag == "ED"){
					geozone.flag = "D";
				}else if(flag == "I"){
					geozone.flag = "I";
					geozone.id = $(this).attr("geofenceid");
				}else {
					geozone.flag = "E";
				}
			}else{
				if(flag == "I"){
					geozone.id = $(this).attr("geofenceid");
				}
			}
			geozone.description = "route geofence description";
			geozone.type = "Point";
			geozone.buffer = $.trim($(this).find(".txtbuffer").val());
			geozone.distance = $.trim($(this).find(".txtroutepointdistance").attr("routepointdistance"));
			geozone.time = $.trim($(this).find(".txtroutepointtime").attr("routepointtime"));
			geozone.isRoutePoint = true;
			geozone.address = $.trim($(this).find(".txtpointaddress").val());
			var isSchoolMark = false;
			if($(this).find(".isSchool").is(':checked')){
				isSchoolMark = true;
			}
			geozone.isSchool = isSchoolMark;
			if(route.type == undefined){
				route.type = 0;
			}
			if(route.type==2){
				geozone.routePointType = $.trim($(this).find(".txtroutepointtype").val());
			}else if(route.type==3){
				if(index==0){
					geozone.routePointType = "1";
				}else{
					geozone.routePointType = "0";
				}
			}else{
				geozone.routePointType = route.type;
			}
			var geoObject = {};
			geoObject.type = "Point";
			var coordinates = [];
			var strLatLng = $.trim($(this).find(".txtlatlng").val());
			var latlng = strLatLng.split(",");
			coordinates.push(latlng[0]);
			coordinates.push(latlng[1]);
			geoObject.coordinates = coordinates;
			geozone.geometry = geoObject;
			arrGeozones.push(geozone);
			});
			route.geozones = arrGeozones;
			route.polylinePoints = routePolylines[routeId].getLatLngs();
			
			if($("#dailyrouteassign").is(":checked")){
				var starttime = $.trim($("#crstarttime").val());
				var endtime = $.trim($("#crendtime").val());
				var entityIdArr = new Array();
				$("#dailyrouteassinmententity > option").each(function() {
				    if(this.selected){
				    	entityIdArr.push(this.value);
				    }
				});
				if(entityIdArr.length===0){
					alert("Please select entity for daily route assignment.");
					return;
				}
				
				if(starttime == '' || starttime == undefined || endtime == '' || endtime ==  undefined){
					alert("Either Daily Route Starttime OR Endtime is blank.");
					return;
				}else{
					starttime = starttime.split(":");
					var hours = parseInt(starttime[0]);
					var minutes = parseInt(starttime[1]);
					starttime = parseInt(3600 * hours) + parseInt(60 * minutes);
					
					endtime = endtime.split(":");
					var hours = parseInt(endtime[0]);
					var minutes = parseInt(endtime[1]);
					endtime = parseInt(3600 * hours) + parseInt(60 * minutes);
				}
				var dailyRouteAssignment = {};
				dailyRouteAssignment.startTime = starttime;
				dailyRouteAssignment.endTime = endtime;
				dailyRouteAssignment.entityId = entityIdArr;
				dailyRouteAssignment.status = 1;
				
				route.dailyRouteAssignment = dailyRouteAssignment;
			}
			if(operationMode == "I"){
				controller.saveRoute(route);
			}else{
				route.id = routeId;
				controller.updateRoute(route);	
			}
		}
	});
	
	$(document).off('click','.editroute');
	$(document).on('click','.editroute',function(){
		//1. reset creation functionality with confirmation of user.
		
		//2. prepare editmode
		
		customRouteOperation["operationMode"] = "U";
		customRouteOperation["routeId"] =  $(this).closest(".routeitem").attr("routeid");
		routeId = customRouteOperation.routeId;
		
		el.hideRouteListItemContainer();
		el.hideBtnCreateCustomRoute();
		el.showRouteCreationContainer();
		el.editRoute();
		el.updateMarkerSequence();
	});
	
	$(document).off('click','.deleteroute');
	$(document).on('click','.deleteroute',function(){
		var flag = confirm(confirmationMessage);
		if(flag)
			{
			 controller.deleteRoute($(this).closest(".routeitem").attr("routeid"));
			}
	});
	
	//highlight marker on hover routepoint in routepoint list.
	$(document).off('mouseover','.routepoint');
	$(document).on('mouseover','.routepoint',function(){
		var routePointId = $(this).attr('routepointid');
		$("div[markerpointid="+routePointId+"]").find('i').css("color","red");
		}).on('mouseout','.routepoint',function(){
			$('.mmileaflet_cricon').parent().find('i').css('color','#1CCACC');
		});
	
	$(".nav-tabs a").click(function(){
		var tab = $(this).attr("cr");
        if(tab == "R")
        	{
        	//clear route assignment work.
        	el.resetRouteAssignment();
        	el.routeMode();
        	}
        else if(tab == "RA")
        	{
        	//clear route tab work
        	resetCustomRoute();
        	el.routeAssignMode();
        	}
    });
	
	$("#crslcroute").change(function(){
		 removeRoute();
		 routeId = $(this).val();
		 displayRoute();
		 el.displayRouteAssignPoints();
		 el.updateMarkerSequence();
		 disableRoutePoints();
	});
	
	$("#crbtnsubmitassignment").click(function(){
		if(el.validateRouteAssignForm())
			{
			var routeId = $("#crslcroute").val();
			var entityId = $("#crslcentity").val();
			var startTime = Util.dateToTimestampInSecond($(".crulassignments > li").eq(0).find(".crplannedtime>input").val());
			var endTime = Util.dateToTimestampInSecond($(".crulassignments > li").eq($(".crulassignments > li").length-1).find(".crplannedtime>input").val());
			var remark = $("#crremark").val();
			var routeAssignInfo = {};
			routeAssignInfo.token = token;
			
			var routeAssignment = {};
			if(routeAssignOperationFlag == "U"){
				routeAssignment.id = routeAssignOperationId;	
			}
			routeAssignment.routeId = routeId;
			routeAssignment.entityId = entityId;
			routeAssignment.accountId = accountId;
			routeAssignment.startTime = startTime;
			routeAssignment.endTime = endTime;
			routeAssignment.status = 0;
			routeAssignment.comment = remark;
			
			var assignments = {};
			var seq = 1;
			
			var isValidPoint = true;
			$(".crulassignments > li").each(function(){
				var geofenceId = $(this).children().attr("routepointid");
				var plannedTime = Util.dateToTimestampInSecond($(this).find(".crplannedtime>input").val());
				if(plannedTime == undefined || plannedTime == ""){
					isValidPoint = false;
					return false;
				}
				var bufferTime = $(this).find(".crtimebuffer").val();
				var distance = $(this).find(".crdistance").text();
				var time = Util.dateToTimestampInSecond($(this).find(".crtime").text());
				var type = $(this).find(".crpointtype").val();
				var assignmentPoint = {};
				assignmentPoint.geofenceId = geofenceId;
				assignmentPoint.plannedTime = plannedTime;
				assignmentPoint.buffer = bufferTime;
				assignmentPoint.distance = distance;
				assignmentPoint.plannedEta = time;
				assignmentPoint.sequence = seq;
				assignmentPoint.type = type;
				assignments[geofenceId] = assignmentPoint;
				seq++;
			});
			
			if(!isValidPoint){
				alert("Please provide planned time for each route point.");
				return;
			}
			
			routeAssignment.assignments = assignments;
			routeAssignment.totalPoints = seq-1;
			routeAssignInfo.routeAssignment = routeAssignment;
			if(routeAssignOperationFlag == "I"){
				controller.saveRouteAssign(routeAssignInfo);	
			}else{
				controller.updateRouteAssign(routeAssignInfo);
			}
			
			}
	});
	
	$("#crbtncancleassignment").click(function(){
		el.resetRouteAssignment();
	});
	
	$("#crstarttime").timepicker({
		showMeridian : false,
		minuteStep: 5
	});
	
	$("#crendtime").timepicker({
		showMeridian : false,
		minuteStep: 5
	});
	
	$("#dailyrouteassign").click(function(){
		 if($(this).is(":checked")) {
			 $("#dailyrouteassigntimediv").show();
		 } else {
			 $("#dailyrouteassigntimediv").hide();
		 }
	});
	
	$(document).on('click','.editrouteassign',function(){
		routeAssignOperationFlag="U";
		var routeId = $(this).closest("tr").attr("routeid");
		var routeAssignId = $(this).closest("tr").attr("routeassignid");
		routeAssignOperationId = routeAssignId; 
		$("#crslcroute").val(routeId);
		$("#crslcroute").select2().select('val',routeId);
		$("#crslcroute").trigger('change');
		var routeAssignData = routeAssignDetailsObj[routeAssignId];
		$("#crslcentity").val(routeAssignData.entityId);
		$("#crslcentity").select2().select('val',routeAssignData.entityId);
//		$("#crstarttime").find("input").val(Util.UnixDateTime(routeAssignData.startTime));
//		$("#crendtime").find("input").val(Util.UnixDateTime(routeAssignData.endTime));
		$("#crremark").val(routeAssignData.comment);
		
		
		var assignPoints = routeAssignData.assignments;
		for(var id in assignPoints){
			var plannedTime = assignPoints[id].plannedTime;
			var plannedEta = assignPoints[id].plannedEta;
			
			if(plannedTime !== null && plannedTime !== undefined &&  plannedTime !== "")
				{
				plannedTime = Util.UnixDateTime(plannedTime);
				}else{
					plannedTime = "";
				}
			if(plannedEta !== null && plannedEta !== undefined &&  plannedEta !== "")
			{
				plannedEta = Util.UnixDateTime(plannedEta);
			}else{
				plannedEta = "";
			}
			
			var slcElem = $('.crulassignments [routepointid='+id+']');
			slcElem.find('.crplannedtime>input').val(plannedTime);
			slcElem.find('.crtimebuffer').val(assignPoints[id].buffer);
			slcElem.find('.crpointtype').val(assignPoints[id].type);
			var routeData = routeListDetailsObj[routeId];
			var points = routeData.points;
			var time ="";
			for(var index in points){
				if(points[index].geozoneId == id){
					time = points[index].time;
				}
			}
			slcElem.find('.crtime').text(plannedEta);
			if(routeAssignData.status !== 0)
				{
				var selectedElem = slcElem.children().eq(slcElem.children().length-1);
				var actualTime = assignPoints[id].actualTime;
				var actualSequence  = assignPoints[id].actualSequence;
				if(actualTime !== null && actualTime !== undefined &&  actualTime !== "")
				{
					actualTime = Util.UnixDateTime(actualTime);
				}else{
					actualTime = "";
				}
				if(actualSequence == undefined)
					{
					actualSequence = '-';
					}
				var elemActualTime = $('<div class="form-group"><label class="control-label col-sm-5" style="padding-left:0px"><b>Actual Time:</b></label><div class="col-sm-7"><label class="control-label  crtime" style="padding-left:0px">'+actualTime+'</label></div></div>');
				selectedElem.append(elemActualTime);	
				var elemActualSeq = $('<div class="form-group"><label class="control-label col-sm-5" style="padding-left:0px"><b>Actual Sequence:</b></label><div class="col-sm-7"><label class="control-label  crtime" style="padding-left:0px">'+actualSequence+'</label></div></div>');
				selectedElem.append(elemActualSeq);
				}
		}
		
		if(routeAssignData.status == 0)
			{
			el.enableRouteAssignForm();	
			}
		else{
			el.disableRouteAssignForm();
			
		}
		
	});
	
	$(document).on('click','.deleterouteassign',function(){
		var routeAssignId = $(this).closest("tr").attr("routeassignid");
		var flag = confirm(confirmationMessage);
		if(flag)
			{
			if(routeAssignOperationId == routeAssignId)
				{
				el.resetRouteAssignment();
				}
			controller.deleteRouteAssign(routeAssignId);
			}
	});
	
	$(document).on('input',".crulassignments .crtimebuffer",function(){
		
		if(isNaN($(this).val()))
			{
			alert('Please enter buffer time in seconds.');
//			return false;
			}
		
		var elemIndex = $('.crulassignments .routepoint').index($(this).closest('.routepoint'));
		var firstElem = $('.crulassignments .routepoint').eq(0);
		var timestamp = Util.dateToTimestampInSecond(firstElem.find('.crplannedtime>input').val());
		if(timestamp == "")
			{
			alert("Please enter start planned time.");
			return false;
			}
		$('.crulassignments .routepoint:eq('+elemIndex+')').nextAll().andSelf().each(function(){
			var bufferTime = parseInt($(this).find('.crtimebuffer').val());
			if(bufferTime == "" || isNaN(bufferTime))
				{
				bufferTime = 0;
				}
			if(elemIndex == "0")
				{
					
					if($.trim(bufferTime) !== "" && !isNaN(bufferTime))
						{
						timestamp = timestamp + bufferTime;
						}
					
				}else{
					var routeData = routeListDetailsObj[routeId];
					var points = routeData.points;
					var point = points[elemIndex+1];
					var prevElem = $('.crulassignments .routepoint').eq(elemIndex-1);
					timestamp = Util.dateToTimestampInSecond(prevElem.find('.crtime').text());
					 if($.trim(bufferTime) !== "" && !isNaN(bufferTime))
						{
						timestamp = timestamp + bufferTime;
						}
					timestamp += point.time;
				}
			elemIndex++;
			$(this).find(".crtime").text(Util.UnixDateTime(timestamp));
		});
	});
	
	$(document).off('click','.expend-croute-details');
	$(document).on('click','.expend-croute-details',function(){
		$(this).toggleClass('glyphicon-menu-right glyphicon-menu-down');
		$(this).closest('tr').next().toggle();
	});
	
	$(document).off('click','.showcractualroute');
	$(document).on('click','.showcractualroute',function(){
		var assignId = $(this).closest('tr').attr('routeassignid');
		var routeAssign = routeAssignDetailsObj[assignId];
		var entityId = routeAssign.entityId;
		var assignments = routeAssign.assignments;
		var startTime = assignments[Object.keys(assignments)[0]].plannedEta;
		var date = new Date();
		var endTime = Math.round(date.getTime()/1000);
		controller.getEvents(entityId,startTime,endTime,assignId);
	});
	
	$(document).on("change","#routetype",function(){
		if($(this).val()=='2'){
			$(".txtroutepointtypecontainer").removeAttr("style");
			$(".txtroutepointtypecontainer").show();
		}else{
			$(".txtroutepointtypecontainer").hide();
		}
	});
	
	$(document).on("click",".customroutemanualclosed",function() {
		var selectedTr = $(this).closest("tr");
		var routeName = selectedTr.attr("routeName");
		var comment=" ";
		if(selectedTr.attr("comment")=="null")
			comment="";
		else
			comment=selectedTr.attr("comment");
			
		var routeassignid=selectedTr.attr("routeassignid");
		$("#customrouterouteName").val(routeName);
		
		$("#customrouteRemarks").text(comment);
		$("#customrouteassignid").val(routeassignid);
		
	});
	$(document).on("click","#customroutereassignment",function() {
		var remarks=$("#customrouteRemarks").text();
		var routeAssingmentId=$("#customrouteassignid").val();
		 //$(".preloader").css('display','block');
		 $.ajax({
			 type: "POST",
	            data : "routeAssingmentId="+routeAssingmentId+"&token="+token+"&remarks="+remarks,
				 url: apiUrl+"routeclose",
	            success: function (response) {
	            	if(response.status==200)
	            		{
	            		controller.getRouteAssignList(myproject.customRoute.timestamp);
	            		alert("Route assignment save successfully.");
	            		 $('#editcustomroutemodal').modal('toggle');
	            		 $("#customrouteRemarks").val("");
	            		}
	            	

	            }
	            , error: function (xhr) {
	                alert(xhr.responseText);
	            }

	        });
	});
	
	$(document).on("click","#btnaddpoint",function(){
		var geofenceid = $("#routepointslist").val();
		var latlng = {
			lat : $("#routepointslist").select2().find(":selected").attr("pointlat"),
			lng : $("#routepointslist").select2().find(":selected").attr("pointlng")
		}
		var id = generateUniqueId();
		createMarker(latlng,id);
		updateAddress(latlng,id);
		el.addItem(id,geofenceid);
		el.updateMarkerSequence();
	});
	
	$(document).on("keyup",".txtpointname,.txtbuffer",function(){
		var routePointId = $(this).parent("div").parent("div").parent("div").attr("routepointid");
		var routeId = $(this).parent("div").parent("div").parent("div").attr("routeid");
		if($(this).hasClass("txtpointname")){
			$(this).parent("div").parent("div").parent("div").attr("routepointname",$(this).val());
		}
		var elem = el.routeItemContainer.find('div[routepointid='+routePointId+'][routeid='+routeId+']');
		if(elem.attr("flag") == "E"){
			elem.attr("flag","EU");
		}
	});
	
	$(document).on("click",".isSchool",function(){
		if($(this).is(':checked')){
			$(".isSchool").prop("checked", false);
			$(".isSchool").hide();
			$(".isSchool").next().hide();
			$(this).prop("checked", true);
			$(this).show();
			$(this).next().show();
		}else{
			$(".isSchool").prop("checked", false);
			$(".isSchool").show();
			$(".isSchool").next().show();
		}
		var routePointId = $(this).parent("div").parent("div").parent("div").attr("routepointid");
		var routeId = $(this).parent("div").parent("div").parent("div").attr("routeid");
		var elem = el.routeItemContainer.find('div[routepointid='+routePointId+'][routeid='+routeId+']');
		if(elem.attr("flag") == "E"){
			elem.attr("flag","EU");
		}
	});
	
	$("#searchcustomroutelistinput").keyup(function(){
		var text = $.trim($(this).val().toLowerCase());
		var elements = $("#customroutelistcontainer .routeitem");
		elements.hide();
		elements.filter(function(){
		 return $(this).find('a').text().toLowerCase().indexOf(text) == 0;	
		}).show();
		
	});	
	
	
	return customRoute;
})();
