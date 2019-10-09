;(function(){
	'use strict';

	angular.module('myApp').factory('liveService',liveService);

	liveService.$inject = ['$http','$q','constants'];

	function liveService($http,$q,constants){

		var somevalue = '';
		var someOtherValue = '';
		var service = {
			somevalue:somevalue,
			getLiveData:getLiveData

		}

		return service;

		//////////

		function getLiveData(){

			return $http.get('https://sampleurl')
				.then(getLiveDataCompleted)
				.catch(getLiveDataFailed);

				function getLiveDataCompleted(response){
					return response.data;
				}

				function getLiveDataFailed(error){
					var newMessage = 'XHR Failed for getLiveData';
					error.data  = newMessage;
					if(error.data && error.data.description)
					{
						newMessage+='\n'+error.data.description;
						error.data.description = newMessage;

					}

					return $q.reject(error)
					// logger.error('XHR Failed for getLiveData. '+error.data);
				}

		}
	}

})();
