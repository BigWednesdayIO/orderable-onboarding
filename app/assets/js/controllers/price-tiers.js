function PriceTiersController (membershipsService, priceAdjustmentsService, members, priceTiers) {
	var vm = this;

	vm.members = members;

	vm.priceTiers = priceTiers;

	vm.newPriceTier = priceAdjustmentsService.createNewPriceTier;

	vm.updateCustomerMemberships = function() {
		vm.members.map(function(memberDetails) {
			return membershipsService
				.updateCustomerMembership(memberDetails);
		});
	};
}

PriceTiersController.resolve = /* @ngInject */ {
	members: function(membershipsService) {
		return membershipsService
			.getMemberships();
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
