function ProductController ($state, productService, productCategory) {
	var vm = this;

	vm.firstTime = $state.params.first;

	vm.product = {
		category_id: $state.params.category || ' ',
		taxable: $state.params.taxable !== 'false'
	};

	vm.supplierProduct = {};

	vm.productCategory = productCategory;

	vm.saveProduct = function() {
		return productService
			.addProduct(vm.product, vm.supplierProduct)
			.then(function(supplierProduct) {
				if (!$state.params.category) {
					$state.go('product-category', {
						id: supplierProduct.id
					});
					return;
				}
				$state.go('review-product', {
					id: supplierProduct.id
				});
			});
	}
}

ProductController.resolve = /* @ngInject */ {
	productCategory: function($q, $stateParams, categoriesService) {
		if (!$stateParams.category) {
			return;
		}

		return categoriesService
			.getNameForCategory($stateParams.category);
	}
};

angular
	.module('app')
	.controller('ProductController', ProductController);
