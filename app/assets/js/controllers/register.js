function RegisterController ($state, supplierService) {
	var vm = this;

	vm.register = function() {
		return supplierService
			.updateInfo({
				email: vm.email,
				mobile: vm.mobile,
				user_name: vm.name
			})
			.then(function() {
				$state.go('name');
			})
	}
}

angular
	.module('app')
	.controller('RegisterController', RegisterController);
