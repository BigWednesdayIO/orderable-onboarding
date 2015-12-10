function SignInController ($state, $http, $q, API, browserStorage, _) {
	var vm = this;

	vm.signIn = function() {
		return $http({
			method: 'GET',
			url: API.suppliers
		})
			.then(function(suppliers) {
				var supplier = _.find(suppliers, {email: vm.email});

				if (!supplier) {
					return $q.reject();
				}

				browserStorage.setItem('supplier_id', supplier.id);
				return $state.go('dashboard');
			})
	};
}

angular
	.module('app')
	.controller('SignInController', SignInController);
