function LoginChecker ($rootScope, $state, authenticationService) {
	var registrationSteps = ['home', 'register', 'sign-in'];

	$rootScope.$on('$stateChangeStart', function(e, toState) {
		var isRegistering = registrationSteps.indexOf(toState.name) >= 0;
		var isLoggedIn = authenticationService.isAuthenticated();

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

		if (isLoggedIn && !isRegistering) {
			$rootScope.isSignedIn = true;
		}
	});
}

angular
	.module('app')
	.run(LoginChecker);
