function SetupStepsService ($sce, $q, productService, supplierService) {
	var service = this;

	function safeDescription (step) {
		step.description = $sce.trustAsHtml(step.description);
		return step;
	}

	function atLeastOneEnabled (paymentMethods) {
		return paymentMethods.some(function(method) {
			return method.enabled;
		})
	}

	service.getSetupSteps = function() {
		return $q.all([
			supplierService
				.getInfo(),
			supplierService
				.getPaymentMethods(),
			productService
				.getProducts()
		])
			.then(function(responses) {
				var supplierInfo = responses[0];
				var paymentMethods = responses[1];
				var products = responses[2];

				var pending = [];
				var completed = [];

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

				// if (atLeastOneEnabled(paymentMethods)) {
				// 	completed.push({
				// 		name: 'You\'re all ready to take payments',
				// 		description: 'Payment methods can added or removed from <a href="account/">your account</a> at any time'
				// 	});
				// } else {
				// 	pending.push({
				// 		name: 'Set up a payment method',
				// 		description: 'Orderable uses <a href="https://stripe.com/gb" target="_blank">Stripe</a> to securely handle payments for you. To get paid you\'ll need to set up an account',
				// 		action: 'account/',
				// 		icon: 'payment'
				// 	});
				// }

				return {
					pending: pending.map(safeDescription),
					completed: completed.map(safeDescription)
				};
			});
	};
}

angular
	.module('app')
	.service('setupStepsService', SetupStepsService);
	