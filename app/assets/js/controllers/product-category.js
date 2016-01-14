function ProductCategoryController ($state, productService, categoriesService, productData, suggestedCategory, suggestedCategoryHierarchy, siblingCategories) {
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

	vm.product.category_id = suggestedCategory || null;

	vm.editing = !suggestedCategory;

	vm.suggestedCategory = suggestedCategory;

	vm.categories = suggestedCategoryHierarchy;

	vm.currentLevel = directParent(suggestedCategory);

	vm.categoryOptions = siblingCategories;

	vm.drillTo = function(id) {
		vm.currentLevel = id;
		if (vm.product.category_id) {
			vm.product.category_id = null;
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
		vm.product.category_id = category.hierachy;
		updateBreadcrumbs(category.hierachy);
		vm.editing = false;
	};

	vm.otherCategory = function() {
		vm.product.category_id = vm.currentLevel;
		vm.editing = false;
	}

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
			.updateProduct(vm.product)
			.then(function() {
				$state.go('review-product', {
					id: $state.params.id
				});
			});
	};
}

ProductCategoryController.resolve = /* @ngInject */ {
	productData: function($stateParams, productService) {
		return productService
			.getSupplierProduct($stateParams.id, true)
			.then(function(linkProduct) {
				return linkProduct.product;
			});
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
