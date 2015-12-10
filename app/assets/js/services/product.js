function ProductService ($http, $q, API, browserStorage, _) {
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
		} else {
			// Until the API is fixed
			data.was_price = data.price;
		}

		return data;
	}

	service.getProducts = function() {
		var id = browserStorage.getItem('supplier_id');

		return $http({
			method: 'GET',
			url: API.suppliers + '/' + id + '/linked_products?expand[]=product',
		});
	};

	service.getProduct = function(id) {
		return $http({
			method: 'GET',
			url: API.products + '/' + id
		});
	};

	service.getSupplierProduct = function(id) {
		var supplier_id = browserStorage.getItem('supplier_id');

		return $http({
			method: 'GET',
			url: API.suppliers + '/' + supplier_id + '/linked_products/' + id
		});
	};

	service.addProduct = function(productData, supplierProduct) {
		var supplier_id = browserStorage.getItem('supplier_id');
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
		delete product.id;
		delete product._metadata;

		return $http({
			method: 'PUT',
			url: API.products + '/' + product_id,
			data: product
		});
	};

	service.updateSupplierProduct = function(supplierProduct) {
		var id = supplierProduct.id;
		delete supplierProduct.id;

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
