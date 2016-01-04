function OrderDetailsController ($filter, ordersService, orderDetails) {
	var vm = this;
	var $date = $filter('date');
	var deliveryDate = orderDetails.basket.order_forms[0].delivery_date;
	var isToday = $date(deliveryDate, 'yyyy MM dd') === $date(new Date(), 'yyyy MM dd');

	vm.deliveryWindow = (isToday ? 'Today' : $date(deliveryDate, 'EEE, MMM d')) + ', ' + orderDetails.basket.order_forms[0].delivery_window.display_name;

	vm.order = orderDetails;

	vm.markAsCompleted = function() {
		return ordersService
			.updateStatus(orderDetails, 'delivered')
			.then(function(newStatus) {
				vm.order.basket.order_forms[0].status = newStatus;
			});
	};
}

OrderDetailsController.resolve = /* @ngInject */ {
	orderDetails: function($stateParams, ordersService) {
		return ordersService
			.getOrder($stateParams.id);
	}
};

angular
	.module('app')
	.controller('OrderDetailsController', OrderDetailsController);
