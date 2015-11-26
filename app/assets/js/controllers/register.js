function RegisterController ($state, supplierService) {
	var vm = this;

	vm.register = function() {
		return supplierService
			.updateInfo('emai', vm.email)
			.then(function() {
				$state.go('name');
			})
	}
}

angular
	.module('app')
	.controller('RegisterController', RegisterController);
