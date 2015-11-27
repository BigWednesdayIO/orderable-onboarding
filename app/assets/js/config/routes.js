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
		.state('add-product', {
			url: '/products/add/?first&category',
			controller: 'ProductController as vm',
			templateUrl: 'views/add-product.html'
		})
		.state('edit-product', {
			url: '/products/:id/',
			controller: 'ProductController as vm',
			templateUrl: 'views/add-product.html'
		})
		.state('product-category', {
			url: '/products/:id/category/',
			controller: 'ProductCategoryController as vm',
			resolve: ProductCategoryController.resolve,
			templateUrl: 'views/product-category.html'
		})
		.state('review-product', {
			url: '/products/:id/review/',
			templateUrl: 'views/add-product.html'
		})

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
