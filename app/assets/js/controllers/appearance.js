function AppearanceController ($state, appearanceService, supplierService, supplierInfo, colours, banners) {
	var vm = this;

	vm.supplier = supplierInfo;
	vm.colours = colours;
	vm.banners = banners;

	vm.appearance = {
		initials: supplierInfo.initials || appearanceService.pickInitials(supplierInfo),
		colour: supplierInfo.colour || appearanceService.pickAtRandom(colours).value,
		banner_image: supplierInfo.banner_image || appearanceService.pickAtRandom(banners)
	};

	vm.saveAppearance = function() {
		supplierService
			.updateInfo(vm.appearance)
			.then(function() {
				$state.go('account');
			});
	}
}

AppearanceController.resolve = /* @ngInject */ {
	supplierInfo: function(appearanceService, supplierService) {
		return supplierService
			.getInfo();
	},
	colours: function(appearanceService) {
		return appearanceService
			.getColours();
	},
	banners: function(appearanceService) {
		return appearanceService
			.getBanners();
	}
};

angular
	.module('app')
	.controller('AppearanceController', AppearanceController);
