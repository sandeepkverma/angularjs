
;(function(){
	'use strict';

	angular.module('myApp').config(config);

	function config($routeProvider){

		$routeProvider.when('/',{
			templateUrl:'components/dashboard/dashboardView.html'
		})
		.when('/live',{
			templateUrl:'components/live/liveView.html',
			controller:'LiveController',
			controllerAs:'liveVm'
		})
	}

})();