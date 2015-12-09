function RegisterController ($state, supplierService) {
	var vm = this;

	vm.register = function() {
		return supplierService
			.register({
				email: vm.email,
				password: vm.password,
				name: vm.name
			})
			.then(function() {
				$state.go('name');
			})
	}
}

angular
	.module('app')
	.controller('RegisterController', RegisterController);
