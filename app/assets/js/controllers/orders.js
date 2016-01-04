function OrdersController ($state, orders) {
	var vm = this;

	vm.orders = orders;

	vm.viewOrder = function(order) {
		$state.go('order', {
			id: order.id
		});
	};
}

OrdersController.resolve = /* @ngInject */ {
	orders: function(ordersService) {
		return ordersService
			.getOrders();
	}
};

angular
	.module('app')
	.controller('OrdersController', OrdersController);
