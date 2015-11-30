function ToggleMenuDirective ($mdSidenav) {
	return {
		restrict: 'A',
		link: function(scope, element) {
			element.on('click', function() {
				$mdSidenav('menu')
					.toggle();
			});
		}
	};
}

angular
	.module('app')
	.directive('toggleMenu', ToggleMenuDirective);
