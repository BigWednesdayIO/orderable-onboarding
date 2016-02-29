function AccountController (externalLinks, supplierInfo, paymentMethods, deliveryDayNames) {
	var vm = this;

	vm.supplier = supplierInfo;

	vm.paymentMethods = paymentMethods;

	vm.externals = externalLinks;

	vm.deliveryDays = supplierInfo.delivery_days.map(function(day) {
		return deliveryDayNames[day].substring(0, 3);
	}).join(', ');
}

AccountController.resolve = /* @ngInject */ {
	supplierInfo: function(supplierService) {
		return supplierService
			.getInfo()
			.then(supplierService.defaultDeliveryOptions);
	},
	paymentMethods: function(supplierService) {
		return supplierService
			.getPaymentMethods();
	}
};

angular
	.module('app')
	.controller('AccountController', AccountController);
