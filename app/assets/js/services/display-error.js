function DisplayErrorFactory ($mdToast, $q) {
	return function(error) {
		$mdToast.show(
			$mdToast.simple()
				.content(error.message)
				.hideDelay(3000)
		);
		return $q.reject(error);
	}
}

angular
	.module('app')
	.factory('displayError', DisplayErrorFactory);
