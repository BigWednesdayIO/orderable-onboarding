function PaymentMethodController ($mdToast, supplierService, paymentMethod, supplierInfo) {
	var vm = this;

	vm.paymentMethod = paymentMethod;

	vm.supplier = supplierInfo;

	vm.toggleEnabled = function() {
		supplierService
			.enablePaymentMethod(vm.paymentMethod.id, vm.paymentMethod.enabled)
			.then(function() {
				$mdToast.show(
					$mdToast.simple()
						.content('Payment method updated')
				);
			});
	};

	vm.saveChanges = function() {
		supplierService
			.updatePaymentMethod(vm.paymentMethod)
			.then(function() {
				$mdToast.show(
					$mdToast.simple()
						.content('Payment method updated')
				);
			});
	};

	vm.creditOptions = [
		'Since joining Orderable',
		'This financial year',
		'In the past 6 months',
		'In the past month',
		'Performed by ' + supplierInfo.name
	];
}

PaymentMethodController.resolve = /* @ngInject */ {
	paymentMethod: function($stateParams, supplierService) {
		return supplierService
			.getPaymentMethod($stateParams.id);
	},
	supplierInfo: function(supplierService) {
		return supplierService
			.getInfo();
	}
};

angular
	.module('app')
	.controller('PaymentMethodController', PaymentMethodController);
