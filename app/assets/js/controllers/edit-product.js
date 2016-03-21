function EditProductController ($state, $q, productService, productData, supplierProductData, productCategory) {
	var vm = this;

	vm.product = productData;

	vm.supplierProduct = supplierProductData;

	vm.productCategory = productCategory;

	vm.saveProduct = function() {
		return $q.all([
			productService
				.updateProduct(vm.product),
			productService
				.updateSupplierProduct(vm.supplierProduct)
		])
			.then(function(responses) {
				var product = responses[0];
				var supplierProduct = responses[1];

				if (product.category_id && product.category_id !== ' ') {
					$state.go('products');
				} else {
					$state.go('product-category', {
						id: supplierProduct.id
					});
				}
			});
	};

	vm.deleteProduct = function($event) {
		return productService
			.deleteProduct($event, vm.supplierProduct, vm.product)
			.then(function() {
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
	},
	productCategory: function(productData, categoriesService) {
		return categoriesService
			.getNameForCategory(productData.category_id);
	}
};

angular
	.module('app')
	.controller('EditProductController', EditProductController);
