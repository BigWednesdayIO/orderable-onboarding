function NewPriceTierController ($mdDialog) {
	var vm = this;

	vm.cancel = $mdDialog.cancel;

	vm.create = function() {
		$mdDialog.hide(vm.tierName);
	};
}

angular
	.module('app')
	.controller('NewPriceTierController', NewPriceTierController);
