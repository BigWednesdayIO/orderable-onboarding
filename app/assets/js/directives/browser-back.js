function BrowserBackDirective ($window) {
	return {
		restrict: 'A',
		link: function(scope, element) {
			element.on('click', function() {
				$window.history.back();
			});
		}
	};
}

angular
	.module('app')
	.directive('browserBack', BrowserBackDirective);
