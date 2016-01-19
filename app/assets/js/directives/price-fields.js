function PriceFieldsDirective () {
	return {
		restrict: 'EA',
		scope: {
			exVat: '=',
			allowFree: '=',
			taxable: '=',
			required: '=',
			label: '@'
		},
		controller: function($scope) {
			var vm = this;
			var taxMultiplier = vm.taxable ? 1.2 : 1;

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

			vm.incVatUpdated = function() {
				vm.exVat = toPounds(toPence(vm.incVat || 0) / taxMultiplier);
			};

			vm.exVatUpdated = function() {
				vm.incVat = toPounds(toPence(vm.exVat || 0) * taxMultiplier);
			};

			vm.format = function(value) {
				if ((vm[value] === 0 || isNaN(+vm[value])) && !vm.allowFree) {
					vm.exVat = '';
					vm.incVat = '';
					return;
				}
				vm[value] = toPounds(toPence(vm[value]));
			};

			$scope.$watch(function() {
				return vm.taxable;
			}, function(taxable) {
				taxMultiplier = taxable ? 1.2 : 1;
				// TODO check for a dirty value to use
				if (vm.exVat) {
					vm.exVatUpdated();
				}
			});

			if (vm.exVat) {
				vm.format('exVat');
				vm.exVatUpdated();
			}
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/price-fields.html',
		replace: true
	}
}

angular
	.module('app')
	.directive('priceFields', PriceFieldsDirective);
