function ProductService ($q, browserStorage, _) {
	var service = this;

	service.getProducts = function() {
		return $q.when(browserStorage.getItem('products') || []);
	};

	service.getProduct = function(id) {
		return service
			.getProducts()
			.then(function(products) {
				return _.find(products, {id: id});
			});
	};

	service.saveProduct = function(product) {
		if (product.id) {
			return service
				.updateProduct(product);
		}

		return service
			.getProducts()
			.then(function(products) {
				product.id = products.length + '';
				products.push(product);
				browserStorage.setItem('products', products);
				return product;
			});
	};

	service.updateProduct = function(product) {
		return service
			.getProducts()
			.then(function(products) {
				var index = _.findIndex(products, {id: product.id});
				if (index === -1) {
					return $q.reject({
						message: 'No product with id `' + product.id + '` found'
					});
				}
				products[index] = product;
				browserStorage.setItem('products', products);
				return product;
			});
	};
}

angular
	.module('app')
	.service('productService', ProductService);
