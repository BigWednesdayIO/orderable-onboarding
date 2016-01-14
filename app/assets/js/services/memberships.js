function MembershipsService ($http, $q, API, priceAdjustmentTypes, _) {
	var service = this;

	service.getMemberships = function() {
		return $http({
			method: 'GET',
			url: API.memberships
		});
	};

	service.getMembershipById = function(id) {
		return service
			.getMemberships()
			.then(function(memberships) {
				return _.find(memberships, {id: id}) || $q.reject();
			});
	};

	service.updateCustomerMembership = function(membership) {
		var data = angular.copy(membership);

		delete data._metadata;
		delete data.customer_id;
		delete data.id;

		return $http({
			method: 'PUT',
			url: API.customers + '/' + membership.customer_id + '/memberships/' + membership.id,
			data: data
		});
	};

	service.bootstrapMembershipAdjustment = function(productId) {
		return {
			linked_product_id: productId,
			type: priceAdjustmentTypes[0].value,
			start_date: new Date()	
		};
	};

	service.getMembershipPriceAdjustments = function(membership) {
		return $http({
			method: 'GET',
			url: API.customers + '/' + membership.customer_id + '/memberships/' + membership.id + '/product_price_adjustments'
		})
			// Not working due to permissions errors atm
			.catch(function() {
				return [];
			});
	};

	service.saveMembershipPriceAdjustments = function(membership, priceAdjustments) {
		var promises;
		var adjustmentsUrl = API.customers + '/' + membership.customer_id + '/memberships/' + membership.id + '/product_price_adjustments';

		function createAdjustment (url, adjustment) {
			return $http({
				method: 'POST',
				url: adjustmentsUrl,
				data: adjustment
			});
		}

		function updateAdjustment (url, adjustment) {
			var adjustmentData = angular.copy(adjustment);

			delete adjustmentData.id;
			delete adjustmentData._metadata;

			return $http({
				method: 'PUT',
				url: adjustmentsUrl + '/' + adjustment.id,
				data: adjustmentData
			});
		}

		function removeAdjustment (url, adjustment) {
			return $http({
				method: 'DELETE',
				url: adjustmentsUrl  + '/' + adjustment.id
			});
		}

		promises = _.mapValues(priceAdjustments, function(newAdjustment) {
			var adjustment = angular.copy(newAdjustment);

			if (!adjustment.amount) {
				if (adjustment.id) {
					return removeAdjustment(adjustment);
				}
				return;
			}

			adjustment.amount = parseFloat(adjustment.amount.replace(/[£%]/, ''));

			if (adjustment.id) {
				return updateAdjustment(adjustment);
			}

			return createAdjustment(adjustment);
		});

		return $q.all(promises);
	}
}

angular
	.module('app')
	.service('membershipsService', MembershipsService);
