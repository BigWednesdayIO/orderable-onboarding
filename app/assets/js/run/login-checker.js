function LoginChecker ($rootScope, $state, browserStorage) {
	var registrationSteps = ['home', 'register', 'name', 'location'],
		supplierAttributes = ['email', 'mobile', 'name', 'location'];

	$rootScope.$on('$stateChangeStart', function(e, toState) {
		var supplierInfo = browserStorage.getItem('supplier'),
			isRegistering = registrationSteps.indexOf(toState.name) >= 0,
			isLoggedIn = supplierInfo && supplierAttributes.reduce(function(status, attr) {
				return status && supplierInfo[attr];
			}, true);

		if (isLoggedIn && isRegistering) {
			e.preventDefault();
			$state.go('dashboard');
			return;
		}

		if (!isLoggedIn && !isRegistering) {
			e.preventDefault();
			$state.go('home');
			return;
		}
	})
}

angular
	.module('app')
	.run(LoginChecker);
