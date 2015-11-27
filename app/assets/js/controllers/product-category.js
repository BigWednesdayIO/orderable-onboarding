function ProductCategoryController ($state, productService, productData, suggestedCategory, suggestedCategoryHierarchy) {
	var vm = this;

	function updateCategories () {
		categoriesService
			.getHierarchyForCategory()
			.then(function(categories) {
				vm.categories = categories;
			});	
	}

	vm.product = productData;
	vm.product.category = suggestedCategory

	vm.categories = suggestedCategoryHierarchy

	vm.saveProduct = function() {
		return productService
			.saveProduct(vm.product)
			.then(function(product) {
				$state.go('review-product', {
					id: product.id
				});
			});
	}
}

ProductCategoryController.resolve = /* @ngInject */ {
	productData: function($stateParams, productService) {
		return productService
			.getProduct($stateParams.id);
	},
	suggestedCategory: function() {
		return '412.413.499676.6761';
	},
	suggestedCategoryHierarchy: function(categoriesService, suggestedCategory) {
		return categoriesService
			.getHierarchyForCategory(suggestedCategory);
	}
};

angular
	.module('app')
	.controller('ProductCategoryController', ProductCategoryController);
