function AccountController (supplierInfo, paymentMethods) {
	var vm = this;

	vm.supplier = supplierInfo;

	vm.paymentMethods = paymentMethods;
}

AccountController.resolve = /* @ngInject */ {
	supplierInfo: function(supplierService) {
		return supplierService
			.getInfo();
	},
	paymentMethods: function(supplierService) {
		return supplierService
			.getPaymentMethods();
	}
};

angular
	.module('app')
	.controller('AccountController', AccountController);
