function APIService (baseAPI) {
	this.navigation = 'mocks/navigation.json';

	this.products = baseAPI + 'indexes/orderable-products';
	this.search = this.products + '/query';

	this.location_search = baseAPI + 'indexes/orderable-delivery-locations/query';

	this.checkouts = baseAPI + 'checkouts'

	this.categories = 'https://raw.githubusercontent.com/BigWednesdayIO/categories-api/master/categories.json';

	this.suppliers = baseAPI + 'suppliers';

	this.products = baseAPI + 'products';

	this.orders = baseAPI + 'orders';

	this.customers = baseAPI + 'customers';

	this.memberships = 'mocks/memberships.json';

	this.storeUrl = 'https://demo.orderable.co';
}

angular
	.module('app')
	.service('API', APIService);
