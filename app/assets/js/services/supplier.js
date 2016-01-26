function SupplierService ($http, $q, API, authenticationService, browserStorage, _) {
	var service = this;

	function getSupplierId () {
		var deferred = $q.defer();
		var id = authenticationService.getSessionInfo().id;

		if (id) {
			deferred.resolve(id)
		} else {
			deferred.reject({
				message: 'Need to be signed in for that'
			});
		}

		return deferred.promise;
	}

	service.register = function(details) {
		return $http({
			method: 'POST',
			url: API.suppliers,
			data: details
		})
			.then(function(response) {
				return authenticationService
					.signIn({
						email: details.email,
						password: details.password
					});
			});
	};

	service.getInfo = function() {
		return getSupplierId()
			.then(function(id) {
				return $http({
					method: 'GET',
					url: API.suppliers + '/' + id
				});
			})
	};

	service.updateInfo = function(key, value) {
		return service
			.getInfo()
			.then(function(info) {
				var id = info.id;

				delete info.id;
				delete info._metadata;

				if (typeof key === 'string' && typeof value !== 'undefined') {
					info[key] = value;
				} else if (typeof key === 'object' && typeof value === 'undefined') {
					Object.keys(key).forEach(function(attr) {
						info[attr] = key[attr];
					});
				} else {
					return $q.reject({
						message: 'Invalid input format'
					});
				}

				Object.keys(info).forEach(function(attr) {
					if (info[attr] === '') {
						delete info[attr];
					}
				})

				return $http({
					method: 'PUT',
					url: API.suppliers + '/' + id,
					data: info
				});
			});
	};

	service.getDeliveryInfo = function() {
		return getSupplierId()
			.then(function(id) {
				return $http({
					method: 'GET',
					url: API.suppliers + '/' + id + '/depots'
				});
			})
			.then(function(depots) {
				// Working with only one depot for now
				return depots[0];
			});
	};

	service.updateDeliveryInfo = function(info) {
		var depotsUrl;
		var newDeliveryInfo = {
			name: 'default',
			delivery_countries: [],
			delivery_regions: [],
			delivery_counties: [],
			delivery_districts: [],
			delivery_places: []
		};

		function makePlural (type) {
			type = type.replace(/y$/, 'ie');
			return type + 's';
		}

		info.forEach(function(area) {
			newDeliveryInfo['delivery_' + makePlural(area.type)].push(area.location);
		});

		return $q.all([
			service
				.getDeliveryInfo()
				.catch(function() {
					return;
				}),
			getSupplierId()
		])
			.then(function(responses) {
				var deliveryInfo = responses[0];
				depotsUrl = API.suppliers + '/' + responses[1] + '/depots';

				if (deliveryInfo) {
					return deliveryInfo;
				}

				// Create a new depot if there isn't one
				return $http({
					method: 'POST',
					url: depotsUrl,
					data: {
						name: 'default',
						delivery_countries: [],
						delivery_regions: [],
						delivery_counties: [],
						delivery_districts: [],
						delivery_places: []
					}
				});
			})
			.then(function(deliveryInfo) {
				return $http({
					method: 'PUT',
					url: depotsUrl + '/' + deliveryInfo.id,
					data: newDeliveryInfo
				});
			});
	};

	service.getPaymentMethods = function() {
		var paymentMethods = browserStorage.getItem('paymentMethods');

		if (paymentMethods) {
			return $q.when(paymentMethods);
		}

		return $http({
			method: 'GET',
			url: 'mocks/payment-methods.json'
		});
	};

	service.getPaymentMethod = function(id) {
		return service
			.getPaymentMethods()
			.then(function(methods) {
				return _.find(methods, {id: id});
			});
	};

	service.updatePaymentMethod = function(method) {
		return service
			.getPaymentMethods()
			.then(function(methods) {
				var index = _.findIndex(methods, {id: method.id});

				if (index === -1) {
					return $q.reject({
						message: 'Payment method not found'
					});
				}

				methods[index] = method;
				browserStorage.setItem('paymentMethods', methods);
				return method;
			});
	};

	service.enablePaymentMethod = function(id, enabled) {
		return service
			.getPaymentMethods()
			.then(function(methods) {
				var index = _.findIndex(methods, {id: id});

				if (!index === -1) {
					return $q.reject({
						message: 'Payment method not found'
					});
				}

				methods[index].enabled = enabled;
				browserStorage.setItem('paymentMethods', methods);
				return methods[index];
			});
	};
}

angular
	.module('app')
	.service('supplierService', SupplierService);
