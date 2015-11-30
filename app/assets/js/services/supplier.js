function SupplierService ($q, browserStorage) {
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
	}
}

angular
	.module('app')
	.service('supplierService', SupplierService);
