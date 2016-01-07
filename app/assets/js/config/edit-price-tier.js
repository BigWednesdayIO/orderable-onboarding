function EditPriceTierController ($stateParams, priceAdjustmentsService, priceAdjustmentTypes, supplierProducts, priceAdjustments) {
	var vm = this;

	vm.id = $stateParams.id;

	vm.supplierProducts = supplierProducts.map(function(supplierProduct) {
		supplierProduct.adjusted_price = priceAdjustmentsService
			.calculateAdjustedPrice(supplierProduct.price, priceAdjustments[supplierProduct.id]);
		return supplierProduct;
	});
	vm.priceAdjustments = priceAdjustments;

	vm.adjustmentTypes = priceAdjustmentTypes;

	vm.calculateAdjustedPrice = function($index, adjustment) {
		var product = vm.supplierProducts[$index];
		var adjustment = vm.priceAdjustments[product.id];

		vm.supplierProducts[$index].adjusted_price = priceAdjustmentsService
			.calculateAdjustedPrice(product.price, adjustment);
	};

	vm.savePriceAdjustments = function() {
		priceAdjustmentsService
			.savePriceAdjustments(vm.priceAdjustments);
	};
}

EditPriceTierController.resolve = /* @ngInject */ {
	supplierProducts: function(productService) {
		return productService
			.getProducts();
	},
	priceAdjustments: function($stateParams, $q, priceAdjustmentsService, supplierProducts) {
		return $q.all(supplierProducts.reduce(function(promises, linkedProduct) {
			promises[linkedProduct.id] = priceAdjustmentsService
				.getAdjustmentForProductById(linkedProduct.id, $stateParams.id)
				.then(function(adjustment) {
					return adjustment || priceAdjustmentsService
						.bootstrapAdjustment($stateParams.id);
				});

			return promises;
		}, {}));
	}
};

angular
	.module('app')
	.controller('EditPriceTierController', EditPriceTierController);
