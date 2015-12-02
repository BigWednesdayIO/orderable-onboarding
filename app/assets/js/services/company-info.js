function CompanyInfoController (supplierInfo, addressSuggestions) {
	var vm = this;

	vm.company = supplierInfo;

	vm.addressSuggestions = addressSuggestions;
}

CompanyInfoController.resolve = /* @ngInject */ {
	supplierInfo: function(supplierService) {
		return supplierService
			.getInfo();
	},
	addressSuggestions: function(companiesHouseService, supplierInfo) {
		if (supplierInfo.address) {
			return [];
		}

		return companiesHouseService
			.search(supplierInfo.name);
	}
};

angular
	.module('app')
	.controller('CompanyInfoController', CompanyInfoController);
