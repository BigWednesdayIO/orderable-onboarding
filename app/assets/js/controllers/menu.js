function MenuController ($rootScope, $state, supplierService, authenticationService) {
	var vm = this;

	vm.state = function(name) {
		$state.go(name);
	}

	vm.signOut = function() {
		return authenticationService
			.signOut()
			.then(function() {
				return $state.go('home');
			});
	};

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