function DashboardController ($stateParams, setupSteps) {
	var vm = this;

	vm.first = !!$stateParams.first;

	vm.steps = setupSteps.pending;
	vm.completed = setupSteps.completed;
}

DashboardController.resolve = /* @ngInject */ {
	supplierInfo: function(supplierService) {
		return supplierService
			.getInfo();
	},
	products: function(productService) {
		return productService
			.getProducts();
	},
	setupSteps: function($sce, products, supplierInfo) {
		var pending = [];
		var completed = [];

		function safeDescription (step) {
			step.description = $sce.trustAsHtml(step.description);
			return step;
		}

		if (products.length === 0) {
			pending.push({
				name: 'Add some products',
				description: 'To sell to retailers you\'ll need to add your supplies to Orderable',
				action: 'products/add/?first=true',
				icon: 'tag-multiple'
			})
		} else {
			completed.push({
				name: 'You\'ve added ' + products.length + ' product' + (products.length === 1 ? '' : 's'),
				description: 'But you can always <a href="products/add/">add more</a>'
			});
		}

		pending = pending.concat([
			{
				name: 'Set up a payment method',
				description: 'Orderable uses <a href="https://stripe.com/gb" target="_blank">Stripe</a> to securely handle payments for you. To get paid you\'ll need to set up an account',
				icon: 'payment'
			}, {
				name: 'Tell us more about ' + supplierInfo.name,
				description: 'Paper invoices are a thing of the past! Orderable takes away the hastle and automatically generates invoices for retailers on purchase. To do that we need a few things from you',
				icon: 'info'
			}
		]);

		return {
			pending: pending.map(safeDescription),
			completed: completed.map(safeDescription)
		};
	}
};

angular
	.module('app')
	.controller('DashboardController', DashboardController);
