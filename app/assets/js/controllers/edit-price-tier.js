function EditPriceTierController ($stateParams, $filter, priceAdjustmentsService, priceAdjustmentTypes, supplierProducts, priceAdjustments) {
	var vm = this;
	var $currency = $filter('currency');

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

	vm.maskInput = function(id) {
		vm.priceAdjustments[id].amount = priceAdjustmentsService
			.maskAdjustment(vm.priceAdjustments[id]);
	}

	vm.adjustmentPlaceholder = function(supplierProduct) {
		var placeholders = {
			value_override: $currency(supplierProduct.price, '£'),
			value_adjustment: $currency(0, '£'),
			percentage_adjustment: '0%'
		};

		return placeholders[vm.priceAdjustments[supplierProduct.id].type];
	}

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
					if (adjustment) {
						adjustment.amount = priceAdjustmentsService
							.maskAdjustment(adjustment);
					} else {
						adjustment = priceAdjustmentsService
							.bootstrapAdjustment($stateParams.id);
					}
					return adjustment;
				});

			return promises;
		}, {}));
	}
};

angular
	.module('app')
	.controller('EditPriceTierController', EditPriceTierController);
