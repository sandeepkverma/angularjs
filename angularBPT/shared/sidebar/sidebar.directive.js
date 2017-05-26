;(function(){
	'use strict';

	angular.module('shared.myWidget',[]).directive('testDirective',testDirective);

	function testDirective(){
		
		var directive = {
			link:link,
			templateUrl:'shared/sidebar/sidebarView.html',
			restrict:'EA',
			  scope: {
        	    max: '='
       		 },
	        controller: ExampleController,
	        controllerAs: 'vm',
	        bindToController: true

		}
		return directive;
		

		function link(scope,element,attrs){

			/* implementation is here */
		}
	}

	function ExampleController() {
    var vm = this;
    vm.min = 3;
    vm.$onInit = onInit;
    
    function onInit()  {
        console.log('CTRL: vm.min = %s', vm.min);
        console.log('CTRL: vm.max = %s', vm.max);
    }
}

})();