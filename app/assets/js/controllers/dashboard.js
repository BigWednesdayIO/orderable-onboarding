function DashboardController (supplierInfo) {
	var vm = this;

	vm.supplier = supplierInfo;
}

DashboardController.resolve = /* @ngInject */ {
	supplierInfo: function(supplierService) {
		return supplierService
			.getInfo();
	}	
};

angular
	.module('app')
	.controller('DashboardController', DashboardController);
