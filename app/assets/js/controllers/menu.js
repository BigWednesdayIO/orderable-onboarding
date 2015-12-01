function MenuController ($rootScope, $state, supplierService) {
	var vm = this;

	vm.state = function(name) {
		$state.go(name);
	}

	$rootScope.$on('$stateChangeSuccess', function() {
		supplierService
		.getInfo()
		.then(function(info) {
			vm.supplier = info;
		});
	});
}

angular
	.module('app')
	.controller('MenuController', MenuController);