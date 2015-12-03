function GetProductImageDirective ($timeout, imageService) {
	return {
		restrict: 'EA',
		scope: {
			croppingData: '='
		},
		link: function(scope, element) {
			var takePicture = element[0].querySelector('input');
			var showPicture = element.find('img');

			function feedbackData (data) {
				// No really, the docs suggest this:
				// https://docs.angularjs.org/error/$rootScope/inprog?p0=$apply#common-causes
				$timeout(function() {
					scope.croppingData = data;
				}, 0);
			}

			takePicture.onchange = function(event) {
				var file = (event.target.files || [])[0];
				
				imageService
					.clearFromCache(scope.showPictureSrc)
					.then(function() {
						return imageService
							.getUrlFromFile(file);
					})
					.catch(function() {
						scope.showPictureSrc = null;
						scope.editing = false;
					})
					.then(function(url) {
						scope.showPictureSrc = url;
						showPicture.on('load', function() {
							var cropBox = imageService.setupCropping(showPicture);
							imageService.setupPinchZoom(showPicture, cropBox);
							feedbackData(cropBox.getData());
							showPicture.on('guillotinechange', function(e, data) {
								feedbackData(data);
							});
							scope.editing = true;
						});
					});
			};

			scope.transform = function($event, action) {
				$event.preventDefault();
				showPicture.guillotine(action);
			};

			scope.done = function($event) {
				$event.preventDefault();
				imageService.finishEditing(showPicture)
				scope.editing = false;
			};

			scope.newImage = function($event) {
				$event.preventDefault();
				angular.element(takePicture).click();
			};
		},
		templateUrl: 'views/partials/get-product-image.html'
	}
}

angular
	.module('app')
	.directive('getProductImage', GetProductImageDirective);
