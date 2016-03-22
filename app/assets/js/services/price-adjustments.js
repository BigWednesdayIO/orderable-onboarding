function PriceAdjustmentsService ($filter, $mdDialog, $state, $http, $q, API, displayError, authenticationService, priceAdjustmentTypes, _) {
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

	service.bootstrapAdjustment = function(groupId) {
		return {
			price_adjustment_group_id: groupId,
			type: priceAdjustmentTypes[0].value,
			start_date: new Date()
		};
	};

	service.maskAdjustment = function(adjustment) {
		if (typeof adjustment.amount === 'string') {
			adjustment.amount = parseFloat(adjustment.amount.replace(/[^\d\.]/g, ''));
		}
		return adjustment.type === 'percentage_adjustment' ? $filter('number')(adjustment.amount) + '%' : $filter('currency')(adjustment.amount, '£');
	};

	service.calculateAdjustedPrice = function(basePrice, adjustment) {
		var amount = angular.copy(adjustment.amount);
		var adjustments = {
			value_adjustment: function() {
				return toPounds(toPence(basePrice) - toPence(amount));
			},
			percentage_adjustment: function() {
				return toPounds(toPence(basePrice) * ((100 - amount) / 100));
			},
			value_override: function() {
				return amount;
			},
			default: function() {
				return basePrice;
			}
		};

		if (!amount && amount !== 0) {
			return adjustments.default();
		}

		if (typeof amount === 'string') {
			amount = parseFloat(amount.replace(/[^\d\.]/g, ''));
		}

		if (isNaN(amount)) {
			return adjustments.default();
		}

		return (adjustments[adjustment.type] || adjustments.default)();
	};

	service.savePriceAdjustments = function(priceAdjustments) {
		var promises;
		var supplierId = authenticationService.getSessionInfo().id;

		function createAdjustment (productId, adjustment) {
			return $http({
				method: 'POST',
				url: API.suppliers + '/' + supplierId + '/linked_products/' + productId + '/price_adjustments',
				data: adjustment
			})
				.catch(displayError);
		}

		function updateAdjustment (productId, adjustment) {
			var adjustmentData = angular.copy(adjustment);

			delete adjustmentData.id;
			delete adjustmentData._metadata;

			return $http({
				method: 'PUT',
				url: API.suppliers + '/' + supplierId + '/linked_products/' + productId + '/price_adjustments/' + adjustment.id,
				data: adjustmentData
			})
				.catch(displayError);
		}

		function removeAdjustment (productId, adjustment) {
			return $http({
				method: 'DELETE',
				url: API.suppliers + '/' + supplierId + '/linked_products/' + productId + '/price_adjustments/' + adjustment.id
			})
				.catch(displayError);
		}

		promises = _.mapValues(priceAdjustments, function(newAdjustment, productId) {
			var adjustment = angular.copy(newAdjustment);

			if (!adjustment.amount) {
				if (adjustment.id) {
					return removeAdjustment(productId, adjustment);
				}
				return;
			}

			adjustment.amount = parseFloat(adjustment.amount.replace(/[£%]/, ''));

			if (adjustment.id) {
				return updateAdjustment(productId, adjustment);
			}

			return createAdjustment(productId, adjustment);
		});

		return $q.all(promises);
	};

	service.createNewPriceTier = function($event) {
		return $mdDialog
			.show({
				targetEvent: $event,
				templateUrl: 'views/partials/new-price-tier.html',
				controller: 'NewPriceTierController',
				controllerAs: 'vm',
				clickOutsideToClose: true
			})
			.then(function(name) {
				return $state.go('edit-price-tier', {
					id: name
				});
			});
	};
}

angular
	.module('app')
	.service('priceAdjustmentsService', PriceAdjustmentsService);
