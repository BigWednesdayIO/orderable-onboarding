function OrdersService ($http, $q, API, displayError, authenticationService, _) {
	var service = this;

	service.getOrders = function() {
		return $http({
			method: 'GET',
			url: API.orders,
			params: {
				supplier_id: authenticationService.getSessionInfo().id
			}
		})
			.catch(displayError);
	};

	service.getOrder = function(id) {
		return service
			.getOrders()
			.then(function(orders) {
				return _.find(orders, {id: id});
			});
	};

	service.updateStatus = function(order, status) {
		return $http({
			method: 'PATCH',
			url: API.orders + '/' + order.id + '/order_forms/' + order.basket.order_forms[0].id + '/status',
			data: {
				status: status
			}
		})
			.then(function() {
				return status;	
			})
			.catch(displayError);
	};
}

angular
	.module('app')
	.service('ordersService', OrdersService);
