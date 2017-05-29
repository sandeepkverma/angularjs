;(function(){
	'use strict';

	angular.module('myApp').controller('LiveController',LiveController);

	LiveController.$inject = ['livePrepService'];

	/* @ngInject */
	function LiveController(livePrepService){

		var liveVm = this;

		liveVm.title = 'live tab';
		liveVm.liveData = livePrepService.data;
		liveVm.gotoRefresh = gotoRefresh;
		liveVm.getLiveData = getLiveData;

		// activate();


		////

		function activate(){
			return getLiveData().then(function(){
				console.log('activated live view');
			});
		}

		function gotoRefresh(){
			/*	to go implementation here*/
		}

		function getLiveData() {
			
			return liveService.getLiveData().then(function(data){
				liveVm.liveData = data;
				return liveVm.liveData;
			});	
		}


	}


})();