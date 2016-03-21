function ProductController ($timeout, $location, $state, productService, productCategory) {
	var vm = this;

	vm.firstTime = $state.params.first;

	vm.product = {
		category_id: $state.params.category || ' ',
		taxable: $state.params.taxable !== 'false',
		in_stock: true
	};

	vm.supplierProduct = {};

	vm.productCategory = productCategory;

	vm.saveProduct = function() {
		return productService
			.addProduct(vm.product, vm.supplierProduct)
			.then(function(supplierProduct) {
				var productUrl = '/products/' + supplierProduct.id + '/';

				$location
					.path(productUrl)
					.replace();

				$timeout(function() {
					if (!$state.params.category) {
						$location.path(productUrl + 'category/');
						return;
					}
					$location.path(productUrl + 'review/');
				}, 0);
			});
	};
}

ProductController.resolve = /* @ngInject */ {
	productCategory: function($stateParams, categoriesService) {
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
