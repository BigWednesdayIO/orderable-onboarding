function ProductService ($http, $q, API, authenticationService, _) {
	var service = this;

	function enrichProductData (data) {
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
		data = angular.copy(data);

		if (data.price) {
			data.price = parseFloat(data.price);
		}

		if (data.was_price) {
			data.was_price = parseFloat(data.was_price);
		} else {
			delete data.was_price;
		}

		return data;
	}

	service.getProducts = function() {
		var id = authenticationService.getSessionInfo().id;

		return $http({
			method: 'GET',
			url: API.suppliers + '/' + id + '/linked_products?expand[]=product&hitsPerPage=50'
		});
	};

	service.getProduct = function(id) {
		return $http({
			method: 'GET',
			url: API.products + '/' + id
		});
	};

	service.getSupplierProduct = function(id, expand) {
		var supplier_id = authenticationService.getSessionInfo().id;

		return $http({
			method: 'GET',
			url: API.suppliers + '/' + supplier_id + '/linked_products/' + id + (expand ? '?expand[]=product' : '')
		});
	};

	service.addProduct = function(productData, supplierProduct) {
		var supplier_id = authenticationService.getSessionInfo().id;
		var product_id;

		return $http({
			method: 'POST',
			url: API.products,
			data: enrichProductData(productData)
		})
			.then(function(response) {
				supplierProduct.product_id = product_id = response.id;
				return $http({
					method: 'POST',
					url: API.suppliers + '/' + supplier_id + '/linked_products',
					data: formatSupplierProduct(supplierProduct)
				});
			});
	};

	service.updateProduct = function(product) {
		var product_id = product.id;
		var i;
		delete product.id;
		delete product._metadata;

		i = product.category_id.lastIndexOf('.');
		if (i > -1) {
			product.category_id = product.category_id.substring(i + 1);
		}

		if (product.pack_size === null) {
			delete product.pack_size;
		}

		return $http({
			method: 'PUT',
			url: API.products + '/' + product_id,
			data: product
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
			data: formatSupplierProduct(supplierProduct)
		});
	};
}

angular
	.module('app')
	.service('productService', ProductService);
