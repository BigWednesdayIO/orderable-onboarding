function AccountController (externalLinks, supplierInfo, paymentMethods) {
	var vm = this;

	vm.supplier = supplierInfo;

	vm.paymentMethods = paymentMethods;

	vm.externals = externalLinks;
}

AccountController.resolve = /* @ngInject */ {
	supplierInfo: function(supplierService) {
		return supplierService
			.getInfo()
			.then(function(info) {
				if (typeof info.delivery_lead_time === 'undefined') {
					info.delivery_lead_time = 1;
				}
				if (typeof info.delivery_charge === 'undefined') {
					info.delivery_charge = 0;
				}
				return info;
			});
	},
	paymentMethods: function(supplierService) {
		return supplierService
			.getPaymentMethods();
	}
};

angular
	.module('app')
	.controller('AccountController', AccountController);
