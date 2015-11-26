function DeliveryLocationController ($state, $http, $filter, supplierService) {
	var vm = this;

	vm.location = [];

	vm.locationSearch = function(query) {
		return $http({
			method: 'GET',
			url: 'mocks/uk-towns.json',
			cache: true
		})
			.then(function(response) {
				return $filter('filter')(response, query);
			});
	};

	vm.saveLocation = function() {
		if (vm.searchText.length) {
			vm.location.push(vm.searchText);
		}

		return supplierService
			.updateInfo('location', vm.location)
			.then(function() {
				$state.go('dashboard');
			});
	};
}

angular
	.module('app')
	.controller('DeliveryLocationController', DeliveryLocationController);
