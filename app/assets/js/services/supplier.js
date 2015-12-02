function SupplierService ($http, $q, browserStorage, _) {
	var service = this;

	service.getInfo = function() {
		return $q.when(browserStorage.getItem('supplier') || {});
	};

	service.updateInfo = function(key, value) {
		return service
			.getInfo()
			.then(function(info) {
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
				browserStorage.setItem('supplier', info);
				return info;
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
