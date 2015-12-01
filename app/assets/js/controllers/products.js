function ProductsController (products) {
	var vm = this;

	vm.products = products;
}

ProductsController.resolve = /* @ngInject */ {
	products: function(productService) {
		return productService
			.getProducts();
	}
};

angular
	.module('app')
	.controller('ProductsController', ProductsController);
