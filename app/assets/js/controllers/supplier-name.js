function SupplierNameController ($state, supplierService, appearanceService) {
	var vm = this;

	vm.saveName = function() {
		supplierService
			.updateInfo('name', vm.name)
			.then(function(supplier) {
				return appearanceService
					.createRandomAppearance(supplier);
			})
			.then(function(appearance) {
				return supplierService
					.updateInfo(appearance);
			})
			.then(function() {
				$state.go('location');
			})
	};
}

angular
	.module('app')
	.controller('SupplierNameController', SupplierNameController);
