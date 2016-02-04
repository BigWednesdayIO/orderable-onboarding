function ShareProductDirective () {
	return {
		restrict: 'EA',
		scope: {
			product: '='
		},
		controller: function(API) {
			var vm = this;
			var productUrl = API.storeUrl + '/product/' + vm.product.id + '/';
			var shareMessage = 'I just added ' + vm.product.name;

			vm.shareOptions = [
				{
					name: 'Twitter',
					url: 'http://twitter.com/intent/tweet?text=' + shareMessage + '&amp;url=' + productUrl + '&via=orderableco',
					icon: 'twitter',
					color: '#41B7D8'
				}, {
					name: 'Facebook',
					url: 'https://www.facebook.com/sharer/sharer.php?u=' + productUrl + '&amp;t=' + shareMessage,
					icon: 'facebook-official',
					color: '#3B5997'
				}, {
					name: 'Google+',
					url: 'https://plus.google.com/share?url=' + productUrl,
					icon: 'google-plus-square',
					color: '#D64937'
				}
			];
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/share-product.html',
		replace: true
	};
}

angular
	.module('app')
	.directive('shareProduct', ShareProductDirective);
