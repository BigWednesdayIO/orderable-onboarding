function ProductsController (products) {
	var vm = this;

	vm.products = products;
}

ProductsController.resolve = /* @ngInject */ {
	products: function(productService) {
		return productService
			.getProducts()
			.then(function(products) {
				return products.map(function(supplierProduct) {
					supplierProduct.product.price = supplierProduct.price;
					supplierProduct.product.was_price = supplierProduct.was_price;
					return supplierProduct;
				});
			});
	}
};

angular
	.module('app')
	.controller('ProductsController', ProductsController);
