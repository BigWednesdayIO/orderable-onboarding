function RoutingConfig ($stateProvider, $urlRouterProvider, $locationProvider, $provide, isApp) {
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'views/index.html'
		})

		// Login

		// Registration
		.state('register', {
			url: '/register/',
			controller: 'RegisterController as vm',
			templateUrl: 'views/register.html'
		})
		.state('name', {
			url: '/register/2/',
			controller: 'SupplierNameController as vm',
			templateUrl: 'views/name.html'
		})
		.state('location', {
			url: '/register/3/',
			controller: 'DeliveryLocationController as vm',
			templateUrl: 'views/location.html'
		})

		// Dashboard
		.state('dashboard', {
			url: '/dashboard/',
			controller: 'DashboardController as vm',
			resolve: DashboardController.resolve,
			templateUrl: 'views/dashboard.html'
		})

		// Product

		// Category

		;

	$urlRouterProvider.otherwise("/");

	$locationProvider.html5Mode({
		enabled: true,
		rewriteLinks: true
	});

	if (isApp) {
		$provide.decorator('$sniffer', function($delegate) {
			$delegate.history = false;
			return $delegate;
		});

		$locationProvider.hashPrefix('!');
	}
}

angular
	.module('app')
	.config(RoutingConfig);
