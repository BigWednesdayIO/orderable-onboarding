function DeliveryController ($state, locationService, supplierService, deliveryInfo) {
	var vm = this;

	vm.location = deliveryInfo;

	vm.locationSearch = function(query) {
		return locationService
			.search(query);
	};

	vm.saveLocation = function() {
		return supplierService
			.updateDeliveryInfo(vm.location)
			.then(function() {
				return $state.go('dashboard');
			});
	};
}

DeliveryController.resolve = /* @ngInject */ {
	deliveryInfo: function(supplierService) {
		return supplierService
			.getDeliveryInfo()
			.then(function(deliveryInfo) {
				var isDelivery = new RegExp('^delivery_(.+)s');
				var locations = [];

				Object.keys(deliveryInfo).filter(function(key) {
					return isDelivery.test(key);
				}).forEach(function(key) {
					var type = key.match(isDelivery)[1];

					locations = locations.concat(deliveryInfo[key].map(function(location) {
						return {
							location: location,
							type: type
						};
					}));
				});

				return locations;
			});
	}	
};

angular
	.module('app')
	.controller('DeliveryController', DeliveryController);
