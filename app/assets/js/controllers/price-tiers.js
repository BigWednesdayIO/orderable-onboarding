function PriceTiersController (priceAdjustmentsService, members, priceTiers) {
	var vm = this;

	vm.members = members;

	vm.priceTiers = priceTiers;

	vm.newPriceTier = priceAdjustmentsService.createNewPriceTier;

	vm.updateCustomerMemberships = function() {
		vm.members.map(function(memberDetails) {
			return priceAdjustmentsService
				.updateCustomerMembership(memberDetails);
		});
	};
}

PriceTiersController.resolve = /* @ngInject */ {
	members: function() {
		return [
			{
				_metadata: {
					created: '2016-01-05T14:25:03.276Z'
				},
				membership_number: 'abcdef',
				supplier_id: 'ciih98tyv00080igko0fv1et2',
				customer_id: 'ciiipk89t00070iglel7os9dn',
				id: 'cij1hmu5n00070lc3vik07oxq'
			}
		];
	},
	priceTiers: function() {
		return [
			'1',
			'free'
		];
	}
};

angular
	.module('app')
	.controller('PriceTiersController', PriceTiersController);
