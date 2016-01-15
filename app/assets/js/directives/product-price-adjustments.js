function ProductPriceAdjustmentsDirective () {
	return {
		restrict: 'E',
		scope: {
			linkProducts: '=',
			priceAdjustments: '='
		},
		controller: function($filter, priceAdjustmentsService, priceAdjustmentTypes) {
			var vm = this;
			var $currency = $filter('currency');

			vm.linkProducts = vm.linkProducts.map(function(linkProduct) {
				linkProduct.adjusted_price = priceAdjustmentsService
					.calculateAdjustedPrice(linkProduct.price, vm.priceAdjustments[linkProduct.id]);
				return linkProduct;
			});

			vm.adjustmentTypes = priceAdjustmentTypes;

			vm.calculateAdjustedPrice = function($index, adjustment) {
				var product = vm.linkProducts[$index];
				var adjustment = vm.priceAdjustments[product.id];

				vm.linkProducts[$index].adjusted_price = priceAdjustmentsService
					.calculateAdjustedPrice(product.price, adjustment);
			};

			vm.maskInput = function(id) {
				vm.priceAdjustments[id].amount = priceAdjustmentsService
					.maskAdjustment(vm.priceAdjustments[id]);
			};

			vm.adjustmentPlaceholder = function(linkProduct) {
				var placeholders = {
					value_override: $currency(linkProduct.price, '£'),
					value_adjustment: $currency(0, '£'),
					percentage_adjustment: '0%'
				};

				return placeholders[vm.priceAdjustments[linkProduct.id].type];
			};
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/product-price-adjustments.html',
		replace: true
	};
}

angular
	.module('app')
	.directive('productPriceAdjustments', ProductPriceAdjustmentsDirective);
