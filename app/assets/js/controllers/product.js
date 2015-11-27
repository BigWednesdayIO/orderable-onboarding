function ProductController ($state, productService) {
	var vm = this;

	vm.firstTime = $state.params.first;

	vm.product = {};

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

angular
	.module('app')
	.controller('ProductController', ProductController);
