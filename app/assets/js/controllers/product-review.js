function ProductReviewController (productData, productCategory) {
	var vm = this;

	vm.product = productData;

	vm.productCategory = productCategory
}

ProductReviewController.resolve = /* @ngInject */ {
	productData: function($stateParams, productService) {
		return productService
			.getProduct($stateParams.id);
	},
	productCategory: function(productData, categoriesService) {
		return categoriesService
			.getNameForCategory(productData.category);
	}
};

angular
	.module('app')
	.controller('ProductReviewController', ProductReviewController);
