function ProductThumbDirective () {
	return {
		restrict: 'EA',
		scope: {
			product: '=',
			editable: '='
		},
		link: function(scope, element) {
			element.addClass('product-thumb');
		},
		controller: function() {
			var vm = this;

			vm.product.id = vm.product.id || vm.product.objectID;
			vm.product.thumbnail_image_url = vm.product.thumbnail_image_url || 'assets/images/placeholder.jpg';
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/product-thumb.html'
	}
}

angular
	.module('app')
	.directive('productThumb', ProductThumbDirective);
