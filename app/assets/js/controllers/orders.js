function OrdersController ($state, orders) {
	var vm = this;

	vm.orders = orders;

	vm.hasOrders = Object.keys(orders).length;

	vm.viewOrder = function(order) {
		$state.go('order', {
			id: order.id
		});
	};
}

OrdersController.resolve = /* @ngInject */ {
	orders: function($filter, ordersService) {
		var $date = $filter('date');

		return ordersService
			.getOrders()
			.then(function(orders) {
				return _.groupBy(orders, function(order) {
					return $date(order._metadata.created, 'EEE, MMM d');
				});
			});
	}
};

angular
	.module('app')
	.controller('OrdersController', OrdersController);
