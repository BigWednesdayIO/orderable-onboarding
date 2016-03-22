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

	function deliveryOptionsSetup (supplierInfo) {
		var deliveryOptions = [
			'delivery_charge',
			'delivery_lead_time',
			'delivery_days'
		]

		// False if any of the delivery options are undefined
		return !deliveryOptions.some(function(attr) {
			return typeof supplierInfo[attr] === 'undefined';
		});
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

				if (deliveryOptionsSetup(supplierInfo)) {
					completed.push({
						name: 'Delivery options setup',
						description: 'Accurate delivery times and charges can now be displayed to your customers, before they order'
					});
				} else {
					pending.push({
						name: 'Set delivery options',
						description: 'By entering your delivery days, charges and lead times, Orderable can help to manage your customers expectations',
						action: 'account/delivery-options/',
						icon: 'timetable'
					});
				}

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
	