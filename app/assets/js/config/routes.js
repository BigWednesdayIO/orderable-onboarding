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
			templateUrl: 'views/dashboard.html',
			params: {
				first: null
			}
		})

		// Product
		.state('add-product', {
			url: '/products/add/?first&category',
			controller: 'ProductController as vm',
			resolve: ProductController.resolve,
			templateUrl: 'views/add-product.html'
		})
		.state('edit-product', {
			url: '/products/:id/',
			controller: 'EditProductController as vm',
			resolve: EditProductController.resolve,
			templateUrl: 'views/edit-product.html'
		})
		.state('product-category', {
			url: '/products/:id/category/',
			controller: 'ProductCategoryController as vm',
			resolve: ProductCategoryController.resolve,
			templateUrl: 'views/product-category.html'
		})
		.state('review-product', {
			url: '/products/:id/review/',
			controller: 'ProductReviewController as vm',
			resolve: ProductReviewController.resolve,
			templateUrl: 'views/product-review.html'
		})
		.state('products', {
			url: '/products/',
			controller: 'ProductsController as vm',
			resolve: ProductsController.resolve,
			templateUrl: 'views/products.html'
		})

		// Orders
		.state('orders', {
			url: '/orders/',
			templateUrl: 'views/orders.html'
		})

		// Delivery Location
		.state('delivery', {
			url: '/delivery/',
			controller: 'DeliveryController as vm',
			resolve: DeliveryController.resolve,
			templateUrl: 'views/delivery-location.html'
		})

		// Account
		.state('account', {
			url: '/account/',
			controller: 'AccountController as vm',
			resolve: AccountController.resolve,
			templateUrl: 'views/account.html'
		})
		.state('payment-method', {
			url: '/account/payment-methods/:id/',
			controller: 'PaymentMethodController as vm',
			resolve: PaymentMethodController.resolve,
			templateUrl: 'views/payment-method.html'
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
