function PriceAdjustmentsService ($http, $q, API, authenticationService, priceAdjustmentTypes, _) {
	var service = this;

	function toPence (value) {
		return value * 100;
	}

	function toPounds (value) {
		return Math.round(value) / 100;
	}

	service.getAdjustmentsForProduct = function(id) {
		var session = authenticationService.getSessionInfo();

		return $http({
			method: 'GET',
			url: API.suppliers + '/' + session.id + '/linked_products/' + id + '/price_adjustments'
		});
	};

	service.getAdjustmentForProductById = function(productId, adjustmentId) {
		return service
			.getAdjustmentsForProduct(productId)
			.then(function(adjustments) {
				return _.find(adjustments, {
					price_adjustment_group_id: adjustmentId
				});
			});
	};

	service.bootstrapAdjustment = function(group_id) {
		return {
			price_adjustment_group_id: group_id,
			type: priceAdjustmentTypes[0].value,
			start_date: new Date()
		};
	};

	service.calculateAdjustedPrice = function(basePrice, adjustment) {
		var adjustments = {
			value_adjustment: function() {
				return toPounds(toPence(basePrice) - toPence(adjustment.amount));
			},
			percentage_adjustment: function() {
				return toPounds(toPence(basePrice) * ((100 - adjustment.amount) / 100));
			},
			value_override: function() {
				return adjustment.amount;
			},
			default: function() {
				return basePrice;
			}
		};

		if (!adjustment.amount && adjustment.amount !== 0) {
			return adjustments.default();
		}

		return (adjustments[adjustment.type] || adjustments.default)();
	};

	service.createProductAdjustment = function(productId, adjustment) {
		var supplierId = authenticationService.getSessionInfo().id;

		return $http({
			method: 'POST',
			url: API.suppliers + '/' + supplierId + '/linked_products/' + productId + '/price_adjustments',
			data: adjustment
		});
	};

	service.updateProductAdjustment = function(productId, adjustment) {
		var supplierId = authenticationService.getSessionInfo().id;
		var adjustmentData = angular.copy(adjustment);

		delete adjustmentData.id;
		delete adjustmentData._metadata;

		return $http({
			method: 'PUT',
			url: API.suppliers + '/' + supplierId + '/linked_products/' + productId + '/price_adjustments/' + adjustment.id,
			data: adjustmentData
		});
	};

	service.removeProductAdjustment = function(productId, adjustment) {
		var supplierId = authenticationService.getSessionInfo().id;

		return $http({
			method: 'DELETE',
			url: API.suppliers + '/' + supplierId + '/linked_products/' + productId + '/price_adjustments/' + adjustment.id
		});
	};

	service.savePriceAdjustments = function(priceAdjustments) {
		var promises = [];

		_.forOwn(priceAdjustments, function(adjustment, productId) {
			if (!adjustment.amount && adjustment.amount !== 0) {
				if (adjustment.id) {
					promises.push(service.removeProductAdjustment(productId, adjustment));
				}
				return;
			}

			if (adjustment.id) {
				promises.push(service.updateProductAdjustment(productId, adjustment));
				return;
			}

			promises.push(service.createProductAdjustment(productId, adjustment));
		});

		return $q.all(promises);
	};
}

angular
	.module('app')
	.service('priceAdjustmentsService', PriceAdjustmentsService);
