function ProductController ($state, productService, productCategory) {
	var vm = this;

	vm.firstTime = $state.params.first;

	vm.product = {
		category: $state.params.category
	};

	vm.productCategory = productCategory

	vm.saveProduct = function() {
		return productService
			.saveProduct(vm.product)
			.then(function(product) {
				if (!$state.params.category) {
					$state.go('product-category', {
						id: product.id
					});
					return;
				}
				$state.go('review-product', {
					id: product.id
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
