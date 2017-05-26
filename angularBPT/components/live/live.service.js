;(function(){
	'use strict';

	angular.module('myApp').factory('liveService',liveService);

	liveService.$inject = ['$http'];

	function liveService($http){

		var somevalue = '';
		var someOtherValue = '';
		var service = {
			somevalue:somevalue,
			getLiveData:getLiveData

		}

		return service;

		//////////

		function getLiveData(){

			return $http.get('https://intouch.mapmyindia.com/IntouchAPI/mobileAPI/getlivedata?state=0&token=79827c99914902b178d41474610917b7549b586a')
				.then(getLiveDataCompleted)
				.catch(getLiveDataFailed);

				function getLiveDataCompleted(response){
					return response.data;
				}

				function getLiveDataFailed(error){
					logger.error('XHR Failed for getLiveData. '+error.data);
				}

		}
	}

})();