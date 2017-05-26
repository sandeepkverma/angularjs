;(function(){
	'use strict';

	angular.module('shared.myWidget',[]).directive('testDirective',testDirective);

	function testDirective(){
		return {
			template:"<h1>hello form directive</h1>"
		}
	}

})();