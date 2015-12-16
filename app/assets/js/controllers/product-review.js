function ProductReviewController (productData, productCategory) {
	var vm = this;

	vm.product = productData;

	vm.productCategory = productCategory
}

ProductReviewController.resolve = /* @ngInject */ {
	productData: function($stateParams, productService) {
		return productService
			.getSupplierProduct($stateParams.id, true)
			.then(function(supplierProduct) {
				var product = supplierProduct.product;
				product.price = supplierProduct.price;
				product.was_price = supplierProduct.was_price;
				return product;
			});
	},
	productCategory: function(productData, categoriesService) {
		return categoriesService
			.getNameForCategory(productData.category);
	}
};

angular
	.module('app')
	.controller('ProductReviewController', ProductReviewController);
