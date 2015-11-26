function SupplierNameController ($state, supplierService) {
	var vm = this;

	vm.saveName = function() {
		supplierService
			.updateInfo('name', vm.name)
			.then(function() {
				$state.go('location');
			})
	}
}

angular
	.module('app')
	.controller('SupplierNameController', SupplierNameController);
