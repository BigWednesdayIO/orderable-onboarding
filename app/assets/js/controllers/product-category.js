function ProductCategoryController ($state, $q, productService, categoriesService, productData, suggestedCategory, suggestedCategoryHierarchy, siblingCategories) {
	var vm = this;

	function directParent (category) {
		return category ? category.substring(0, category.lastIndexOf('.')) : '';
	}

	function updateBreadcrumbs (category_id) {
		return categoriesService
			.getHierarchyForCategory(category_id)
			.then(function(categories) {
				vm.categories = categories;
			});	
	}

	vm.product = productData;

	vm.product.category = suggestedCategory || null;

	vm.editing = !suggestedCategory;

	vm.suggestedCategory = suggestedCategory;

	vm.categories = suggestedCategoryHierarchy;

	vm.currentLevel = directParent(suggestedCategory);

	vm.categoryOptions = siblingCategories;

	vm.drillTo = function(id) {
		vm.currentLevel = id;
		if (vm.product.category) {
			vm.product.category = null;
		}
		categoriesService
			.getChildCategories(vm.currentLevel)
			.then(function(categoryOptions) {
				vm.categoryOptions = categoryOptions;
			});
		updateBreadcrumbs(vm.currentLevel);
		vm.editing = true;
	};

	vm.upOneLevel = function() {
		vm.drillTo(directParent(vm.currentLevel));
	};

	vm.categorySelected = function(category) {
		if (category.hasChildren) {
			return vm.drillTo(category.hierachy);
		}
		vm.product.category = category.hierachy;
		updateBreadcrumbs(category.hierachy);
		vm.editing = false;
	};

	vm.useSuggestion = function() {
		vm.categorySelected({
			hierachy: suggestedCategory
		});
		vm.currentLevel = directParent(suggestedCategory);
		vm.editing = false;
	};

	vm.edit = function() {
		vm.editing = true;
	};

	vm.saveProduct = function() {
		return productService
			.saveProduct(vm.product)
			.then(function(product) {
				$state.go('review-product', {
					id: product.id
				});
			});
	};
}

ProductCategoryController.resolve = /* @ngInject */ {
	productData: function($stateParams, productService) {
		return productService
			.getProduct($stateParams.id);
	},
	suggestedCategory: function(categoriesService, productData) {
		return categoriesService
			.suggestCategoryForProduct(productData);
	},
	suggestedCategoryHierarchy: function(categoriesService, suggestedCategory) {
		if (!suggestedCategory) {
			return [];
		}

		return categoriesService
			.getHierarchyForCategory(suggestedCategory);
	},
	siblingCategories: function(categoriesService, suggestedCategory) {
		var directParent = !suggestedCategory ? '' : suggestedCategory.substring(0, suggestedCategory.lastIndexOf('.'));
		return categoriesService
			.getChildCategories(directParent);
	}
};

angular
	.module('app')
	.controller('ProductCategoryController', ProductCategoryController);
