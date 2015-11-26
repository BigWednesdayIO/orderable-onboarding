function FocusPlaceholderDirective () {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.on('focus', function() {
				element.attr('placeholder', attrs.focusPlaceholder);
			});

			element.on('blur', function() {
				element.attr('placeholder', attrs.placeholder);
			});
		}
	};
}

angular
	.module('app')
	.directive('focusPlaceholder', FocusPlaceholderDirective);
