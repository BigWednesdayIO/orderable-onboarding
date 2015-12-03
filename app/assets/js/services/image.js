function ImageService ($window, $q) {
	var service = this;
	var $URL = $window.URL || $window.webkitURL;

	function createImageUrl (file) {
		var imgURL;

		try {
			imgURL = $URL.createObjectURL(file);
			return $q.when(imgURL);
		} catch (e) {
			return $q.reject(e);
		}
	}

	function createImageUrlLegacy (file) {
		var deferred = $q.defer();
		var fileReader;
		
		try {
			fileReader = new FileReader();
			fileReader.onload = function(event) {
				deferred.resolve(event.target.result);
			};
			fileReader.readAsDataURL(file);
		} catch (e) {
			return deferred.reject(e);
		}

		return deferred;
	}

	service.getUrlFromFile = function(file) {
		if (!file) {
			return $q.reject({
				message: 'No file selected'
			});
		}

		return createImageUrl(file)
			.catch(function() {
				return createImageUrlLegacy(file);
			});
	};

	service.clearFromCache = function(file) {
		if (!$URL || !file) {
			return $q.when(false);
		};
		
		$URL.revokeObjectURL(file);
		return $q.when(true);
	};

	service.setupCropping = function(image) {
		return image
			.guillotine({
				height: 180,
				width: 180,
				eventOnChange: 'guillotinechange'
			})
			.guillotine('fit')
			.guillotine('instance');
	};

	service.setupPinchZoom = function(image, cropBox) {
		var mc = new Hammer.Manager(image[0]);
		var pinch = new Hammer.Pinch();
		
		mc.add([pinch]);
		mc.on('pinch', function(ev) {
			// console.log(ev.scale);
			if (ev.scale > 1) {
				cropBox._zoom(Math.sqrt(Math.pow(1.01, ev.scale)));
				// console.log('increase');
			} else {
				cropBox._zoom(Math.sqrt(Math.pow(0.95, ev.scale)));
				// console.log('reduce');
			}
			return;
		});
		return mc;
	};

	service.finishEditing = function(image) {
		image.guillotine('disable');
	};
}

angular
	.module('app')
	.service('imageService', ImageService);
