angular
	.module('app')
	.constant('priceAdjustmentTypes', [
		{
			display_name: '£',
			value: 'value_override'
		}, {
			display_name: '−£',
			value: 'value_adjustment'
		}, {
			display_name: '−%',
			value: 'percentage_adjustment'
		}
	]);
