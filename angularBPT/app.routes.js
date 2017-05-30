
;(function(){
	'use strict';

	angular.module('myApp').config(config);

	config.$inject = ['$routeProvider'];

	function config($routeProvider){

		$routeProvider.when('/',{
			templateUrl:'components/dashboard/dashboardView.html'
		})
		.when('/live',{
			templateUrl:'components/live/liveView.html',
			controller:'LiveController',
			controllerAs:'liveVm',
			resolve:{
				livePrepService:livePrepService
			}
		})
	}
	livePrepService.$inject = ['liveService'];
	function livePrepService(liveService){
		return liveService.getLiveData();
	}

})();