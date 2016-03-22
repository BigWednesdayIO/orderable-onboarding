function OrderMethodController ($state, supplierService, supplierInfo) {
	var vm = this;

	vm.supplier = supplierInfo;

	vm.customOrderEmail = !!supplierInfo.orders_email;

	vm.textNotifications = !!supplierInfo.orders_textsms;

	vm.updateOrderMethod = function() {
		var info = {
			orders_email: (vm.customOrderEmail ? vm.supplier.orders_email : ''),
			orders_textsms: (vm.textNotifications ? vm.supplier.orders_textsms : '')
		};

		supplierService
			.updateInfo(info)
			.then(function() {
				$state.go('account');
			});
	};
}

OrderMethodController.resolve = /* @ngInject */ {
	supplierInfo: function(supplierService) {
		return supplierService
			.getInfo();
	}
};

angular
	.module('app')
	.controller('OrderMethodController', OrderMethodController);
