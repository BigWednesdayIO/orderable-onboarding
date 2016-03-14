function RoutingConfig ($stateProvider, $urlRouterProvider, $locationProvider, $provide, isApp) {
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'views/index.html'
		})

		// Login
		.state('sign-in', {
			url: '/sign-in/',
			controller: 'SignInController as vm',
			templateUrl: 'views/sign-in.html'
		})

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
			url: '/products/add/?first&category&taxable',
			controller: 'ProductController as vm',
			resolve: ProductController.resolve,
			templateUrl: 'views/product.html'
		})
		.state('edit-product', {
			url: '/products/:id/',
			controller: 'EditProductController as vm',
			resolve: EditProductController.resolve,
			templateUrl: 'views/product.html'
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

		// Price tiers
		.state('price-tiers', {
			url: '/price-tiers/',
			controller: 'PriceTiersController as vm',
			resolve: PriceTiersController.resolve,
			templateUrl: 'views/price-tiers.html'
		})
		.state('edit-price-tier', {
			url: '/price-tiers/:id/',
			controller: 'EditPriceTierController as vm',
			resolve: EditPriceTierController.resolve,
			templateUrl: 'views/price-tier.html'
		})
		.state('membership-price-tier', {
			url: '/price-tiers/memberships/:id/',
			controller: 'MembershipPriceTierController as vm',
			resolve: MembershipPriceTierController.resolve,
			templateUrl: 'views/price-tier.html'
		})

		// Orders
		.state('orders', {
			url: '/orders/',
			controller: 'OrdersController as vm',
			resolve: OrdersController.resolve,
			templateUrl: 'views/orders.html'
		})
		.state('order', {
			url: '/orders/:id/',
			controller: 'OrderDetailsController as vm',
			resolve: OrderDetailsController.resolve,
			templateUrl: 'views/order-details.html'
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
		.state('order-method', {
			url: '/account/order-method/',
			controller: 'OrderMethodController as vm',
			resolve: OrderMethodController.resolve,
			templateUrl: 'views/order-method.html'
		})
		.state('delivery-options', {
			url: '/account/delivery-options/',
			controller: 'DeliveryOptionsController as vm',
			resolve: DeliveryOptionsController.resolve,
			templateUrl: 'views/delivery-options.html'
		})
		.state('about', {
			url: '/account/about/',
			controller: 'AboutController as vm',
			resolve: AboutController.resolve,
			templateUrl: 'views/about.html'
		})
		.state('membership', {
			url: '/account/memberships/',
			controller: 'MembershipController as vm',
			resolve: MembershipController.resolve,
			templateUrl: 'views/membership.html'
		})
		.state('appearance', {
			url: '/account/appearance/',
			controller: 'AppearanceController as vm',
			resolve: AppearanceController.resolve,
			templateUrl: 'views/appearance.html'
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
