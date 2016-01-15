function MembershipPriceTierController (membershipsService, membership, tierProducts, priceAdjustments) {
	var vm = this;

	vm.title = membership.membership_number;

	vm.products = tierProducts.map(function(tierProduct) {
		priceAdjustments[tierProduct.id] = priceAdjustments[tierProduct.id] || membershipsService
			.bootstrapMembershipAdjustment(tierProduct.id);
		return tierProduct;
	});

	vm.priceAdjustments = priceAdjustments;

	vm.savePriceAdjustments = function() {
		membershipsService
			.saveMembershipPriceAdjustments(vm.priceAdjustments)
			.then(function() {
				$state.go('price-tiers');
			});;
	};
}

MembershipPriceTierController.resolve = /* @ngInject */ {
	membership: function($stateParams, membershipsService) {
		return membershipsService
			.getMembershipById($stateParams.id);
	},
	linkProducts: function(productService) {
		return productService
			.getProducts();
	},
	tierProducts: function($q, priceAdjustmentsService, membership, linkProducts) {
		var id = membership.price_adjustment_group_id;
		var promises = linkProducts.map(function(linkProduct) {
			return priceAdjustmentsService
				.getAdjustmentForProductById(linkProduct.id, id)
				.then(function(adjustment) {
					if (adjustment) {
						linkProduct.price = priceAdjustmentsService
							.calculateAdjustedPrice(linkProduct.price, adjustment);
					}
					return linkProduct;
				});
		});
		return $q.all(promises);
	},
	priceAdjustments: function(membershipsService, membership) {
		return membershipsService
			.getMembershipPriceAdjustments(membership)
			.then(function(adjustments) {
				return adjustments.reduce(function(mapping, adjustment) {
					mapping[adjustment.linked_roduct_id] = adjustment;
					return mapping;
				}, {});
			});
	}
};

angular
	.module('app')
	.controller('MembershipPriceTierController', MembershipPriceTierController);
