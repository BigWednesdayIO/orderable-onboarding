function MembershipController ($state, supplierService, supplierInfo, _) {
	var vm = this;

	vm.supplier = supplierInfo;

	vm.updateMembershipInfo = function() {
		var info = _.pick(vm.supplier, ['has_memberships', 'purchase_restrictions']);

		supplierService
			.updateInfo(info)
			.then(function() {
				$state.go('account');
			});
	};
}

MembershipController.resolve = /* @ngInject */ {
	supplierInfo: function(supplierService) {
		return supplierService
			.getInfo()
			.then(function(info) {
				if (typeof info.has_memberships === 'undefined') {
					info.has_memberships = false;
				}

				if (typeof info.purchase_restrictions === 'undefined') {
					info.purchase_restrictions = 'none';
				}

				return info;
			});
	}
};

angular
	.module('app')
	.controller('MembershipController', MembershipController);
