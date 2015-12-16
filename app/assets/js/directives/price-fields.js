function PriceFieldsDirective () {
	return {
		restrict: 'EA',
		scope: {
			exVat: '=',
			allowFree: '=',
			required: '='
		},
		link: function(scope, element) {
			Array.prototype.map.call(element.find('input'), function(input) {
				input = angular.element(input);

				input.on('focus', function() {
					input.parent().addClass('has-focus');
				});

				angular.element(input).on('blur', function() {
					input.parent().removeClass('has-focus');
				});
			});
		},
		controller: function() {
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

			vm.incVatUpdated = function() {
				vm.exVat = toPounds(toPence(vm.incVat || 0) / 1.2);
			};

			vm.exVatUpdated = function() {
				vm.incVat = toPounds(toPence(vm.exVat || 0) * 1.2);
			};

			vm.format = function(value) {
				if ((vm[value] === 0 || isNaN(+vm[value])) && !vm.allowFree) {
					vm.exVat = '';
					vm.incVat = '';
					return;
				}
				vm[value] = toPounds(toPence(vm[value]));
			};

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
