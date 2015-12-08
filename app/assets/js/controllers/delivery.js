function DeliveryController (locationService, supplierService, supplierInfo) {
	var vm = this;

	vm.location = supplierInfo.location;

	vm.locationSearch = function(query) {
		return locationService
			.search(query);
	};

	vm.saveLocation = function() {
		if (vm.searchText.length) {
			vm.location.push(vm.searchText);
		}

		return supplierService
			.updateInfo('location', vm.location);
	};
}

DeliveryController.resolve = /* @ngInject */ {
	supplierInfo: function(supplierService) {
		return supplierService
			.getInfo();
	}	
};

angular
	.module('app')
	.controller('DeliveryController', DeliveryController);
