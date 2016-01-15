function EditPriceTierController ($state, priceAdjustmentsService, supplierProducts, priceAdjustments) {
	var vm = this;

	vm.title = $state.params.id;

	vm.products = supplierProducts;

	vm.priceAdjustments = priceAdjustments;

	vm.savePriceAdjustments = function() {
		priceAdjustmentsService
			.savePriceAdjustments(vm.priceAdjustments)
			.then(function() {
				$state.go('price-tiers');
			});
	};
}

EditPriceTierController.resolve = /* @ngInject */ {
	supplierProducts: function(productService) {
		return productService
			.getProducts();
	},
	priceAdjustments: function($stateParams, $q, priceAdjustmentsService, supplierProducts) {
		var promises = supplierProducts.map(function(linkedProduct) {
			return priceAdjustmentsService
				.getAdjustmentForProductById(linkedProduct.id, $stateParams.id)
				.then(function(adjustment) {
					if (adjustment) {
						adjustment.amount = priceAdjustmentsService
							.maskAdjustment(adjustment);
					} else {
						adjustment = priceAdjustmentsService
							.bootstrapAdjustment($stateParams.id);
					}
					return adjustment;
				});
		}).reduce(function(mapping, adjustment, index) {
			mapping[supplierProducts[index].id] = adjustment;
			return mapping;
		}, {});

		return $q.all(promises);
	}
};

angular
	.module('app')
	.controller('EditPriceTierController', EditPriceTierController);
