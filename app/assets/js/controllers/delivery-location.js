function DeliveryLocationController ($rootScope, $state, locationService, supplierService) {
	var vm = this;

	vm.location = [];

	vm.locationSearch = function(query) {
		return locationService
			.search(query);
	};

	vm.saveLocation = function() {
		if ((vm.searchText || '').length) {
			return;
		}

		return supplierService
			.updateDeliveryInfo(vm.location)
			.then(function() {
				return $state.go('dashboard', {
					first: true
				});
			})
			.then(function() {
				$rootScope.isSignedIn = true;
			});
	};
}

angular
	.module('app')
	.controller('DeliveryLocationController', DeliveryLocationController);
