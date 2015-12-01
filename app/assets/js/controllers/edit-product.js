function EditProductController ($state, productService, productData) {
	var vm = this;

	vm.product = productData;

	vm.saveProduct = function() {
		return productService
			.saveProduct(vm.product)
			.then(function(product) {
				$state.go('products');
			});
	}
}

EditProductController.resolve = /* @ngInject */ {
	productData: function($stateParams, productService) {
		return productService
			.getProduct($stateParams.id)
	}
};

angular
	.module('app')
	.controller('EditProductController', EditProductController);
