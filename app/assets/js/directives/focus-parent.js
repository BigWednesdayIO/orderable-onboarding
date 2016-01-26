function FocusParentDirective () {
	return {
		restrict: 'A',
		link: function(scope, element) {
			var raw = element[0];
			var parent = raw.closest('.md-whiteframe-z1');

			if (!parent) {
				return;
			}
			
			parent = angular.element(parent);

			element.on('focus', function() {
				parent.addClass('has-focus');
			});

			element.on('blur', function() {
				parent.removeClass('has-focus');
			});
		}
	};
}

angular
	.module('app')
	.directive('focusParent', FocusParentDirective);
