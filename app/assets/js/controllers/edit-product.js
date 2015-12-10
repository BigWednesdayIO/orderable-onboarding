function EditProductController ($state, $q, productService, productData, supplierProductData) {
	var vm = this;

	vm.product = productData;

	vm.supplierProduct = supplierProductData;

	vm.saveProduct = function() {
		return $q.all([
			productService
				.updateProduct(vm.product),
			productService
				.updateSupplierProduct(vm.supplierProduct)
		])
			.then(function(product) {
				$state.go('products');
			});
	};
}

EditProductController.resolve = /* @ngInject */ {
	supplierProductData: function($stateParams, productService) {
		return productService
			.getSupplierProduct($stateParams.id);
	},
	productData: function(supplierProductData, productService) {
		return productService
			.getProduct(supplierProductData.product_id);
	}
};

angular
	.module('app')
	.controller('EditProductController', EditProductController);
