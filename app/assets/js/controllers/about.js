function AboutController ($state, supplierService, externalLinks, supplierInfo) {
	var vm = this;
	
	vm.supplier = supplierInfo;

	vm.externals = externalLinks;

	vm.saveInfo = function() {
		supplierService
			.updateInfo(vm.supplier)
			.then(function() {
				$state.go('account');
			})
	};
}

AboutController.resolve = /* @ngInject */ {
	supplierInfo: function(supplierService, externalLinks, _) {
		var keys = ['about'].concat(_.pluck(externalLinks, 'attribute'));

		return supplierService
			.getInfo()
			.then(function(info) {
				return _.pick(info, keys);
			});
	}
}

angular
	.module('app')
	.controller('AboutController', AboutController);
