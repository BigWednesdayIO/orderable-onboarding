function ProductReviewController (productData, productCategory) {
	var vm = this;

	vm.product = productData;

	vm.productCategory = productCategory
}

ProductReviewController.resolve = /* @ngInject */ {
	productData: function($stateParams, productService) {
		return productService
			.getSupplierProduct($stateParams.id)
			.then(function(supplierProduct) {
				return productService
					.getProduct(supplierProduct.product_id);
			});;
	},
	productCategory: function(productData, categoriesService) {
		return categoriesService
			.getNameForCategory(productData.category);
	}
};

angular
	.module('app')
	.controller('ProductReviewController', ProductReviewController);
