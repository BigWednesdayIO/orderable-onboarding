function DeliveryOptionsController ($state, supplierService, supplierInfo, deliveryDayNames, _) {
	var vm = this;

	function toPence (value) {
		if (isNaN(+value)) {
			return 0;
		}
		return value * 100;
	}

	function toPounds (value) {
		if (isNaN(+value)) {
			return 0;
		}
		return (Math.round(value) / 100).toFixed(2);
	}

	vm.info = supplierInfo;

	vm.chargeForDelivery = supplierInfo.delivery_charge > 0;

	vm.formatDeliveryCharge = function() {
		vm.deliveryCharge = toPounds(toPence(vm.deliveryCharge));
	};

	vm.deliveryCharge = supplierInfo.delivery_charge;
	vm.formatDeliveryCharge();

	vm.leadTimes = _.range(1, 8);

	vm.deliveryExplainations = {
		1: 'Tuesday',
		2: 'Wednesday',
		3: 'Thursday',
		4: 'Friday',
		5: 'Saturday',
		6: 'the following Monday (no Sunday delivery)',
		7: 'the following Monday'
	};

	vm.deliveryDayNames = deliveryDayNames;

	vm.deliveryDays = supplierInfo.delivery_days.reduce(function(ref, day) {
		ref[day] = true;
		return ref;
	}, {
		0: false,
		1: false,
		2: false,
		3: false,
		4: false,
		5: false,
		6: false
	});

	vm.updateDeliveryOptions = function() {
		var info = _.pick(vm.info, ['delivery_charge', 'delivery_lead_time', 'delivery_days']);
		info.delivery_charge = vm.chargeForDelivery ? vm.deliveryCharge : 0;
		info.delivery_days = _(vm.deliveryDays)
			.map(function(selected, day) {
				return {
					day: day,
					selected: selected
				};
			})
			.filter('selected')
			.map('day')
			.sort()
			.value();

		supplierService
			.updateInfo(info)
			.then(function() {
				$state.go('account');
			});
	};
}

DeliveryOptionsController.resolve = /* @ngInject */ {
	supplierInfo: function(supplierService) {
		return supplierService
			.getInfo()
			.then(supplierService.defaultDeliveryOptions);
	}	
};

angular
	.module('app')
	.controller('DeliveryOptionsController', DeliveryOptionsController);
