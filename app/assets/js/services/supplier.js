function SupplierService ($q, browserStorage) {
	var service = this;

	service.getInfo = function() {
		return $q.when(browserStorage.getItem('supplier') || {});
	};

	service.updateInfo = function(key, value) {
		return service
			.getInfo()
			.then(function(info) {
				info[key] = value;
				browserStorage.setItem('supplier', info);
				return info;
			});
	}
}

angular
	.module('app')
	.service('supplierService', SupplierService);
