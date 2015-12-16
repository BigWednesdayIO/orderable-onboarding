function SignInController ($state, authenticationService) {
	var vm = this;

	vm.credentials = {};

	vm.signIn = function() {
		return authenticationService
			.signIn(vm.credentials)
			.then(function() {
				return $state.go('dashboard');
			})
	};
}

angular
	.module('app')
	.controller('SignInController', SignInController);
