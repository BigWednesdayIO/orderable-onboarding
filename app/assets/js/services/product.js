function ProductService ($http, $q, API, authenticationService, _) {
	var service = this;

	function enrichProductData (data) {
		data.brand = 'Other';
		data.product_type = 'test_product';
		data.product_type_attributes = [
			{
				name: 'test_attribute',
				values: ['a']
			}
		];
		return data;
	}

	function formatSupplierProduct (data) {
		if (data.price) {
			data.price = parseFloat(data.price);
		}

		if (data.was_price) {
			data.was_price = parseFloat(data.was_price);
		}

		return data;
	}

	service.getProducts = function() {
		var id = authenticationService.getSessionInfo().id;

		return $http({
			method: 'GET',
			url: API.suppliers + '/' + id + '/linked_products', // ?expand[]=product
			headers: {
				Authorization: authenticationService.getSessionInfo().token
			}
		});
	};

	service.getProduct = function(id) {
		return $http({
			method: 'GET',
			url: API.products + '/' + id,
			headers: {
				Authorization: authenticationService.getSessionInfo().token
			}
		});
	};

	service.getSupplierProduct = function(id) {
		var supplier_id = authenticationService.getSessionInfo().id;

		return $http({
			method: 'GET',
			url: API.suppliers + '/' + supplier_id + '/linked_products/' + id,
			headers: {
				Authorization: authenticationService.getSessionInfo().token
			}
		});
	};

	service.addProduct = function(productData, supplierProduct) {
		var supplier_id = authenticationService.getSessionInfo().id;
		var product_id;

		return $http({
			method: 'POST',
			url: API.products,
			data: enrichProductData(productData),
			headers: {
				Authorization: authenticationService.getSessionInfo().token
			}
		})
			.then(function(response) {
				supplierProduct.product_id = product_id = response.id;
				return $http({
					method: 'POST',
					url: API.suppliers + '/' + supplier_id + '/linked_products',
					data: formatSupplierProduct(supplierProduct),
					headers: {
						Authorization: authenticationService.getSessionInfo().token
					}
				});
			});
	};

	service.updateProduct = function(product) {
		var product_id = product.id;
		delete product.id;
		delete product._metadata;

		return $http({
			method: 'PUT',
			url: API.products + '/' + product_id,
			data: product,
			headers: {
				Authorization: authenticationService.getSessionInfo().token
			}
		});
	};

	service.updateSupplierProduct = function(supplierProduct) {
		var supplier_id = authenticationService.getSessionInfo().id;
		var id = supplierProduct.id;
		delete supplierProduct.id;
		delete supplierProduct._metadata;

		return $http({
			method: 'PUT',
			url: API.suppliers + '/' + supplier_id + '/linked_products/' + id,
			data: formatSupplierProduct(supplierProduct),
			headers: {
				Authorization: authenticationService.getSessionInfo().token
			}
		});
	};
}

angular
	.module('app')
	.service('productService', ProductService);
