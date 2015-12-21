function LocationService ($http, $q, $mdToast, API) {
	var service = this;

	service.search = function(query) {
		return $http({
			method: 'POST',
			url: API.location_search,
			data: {
				query: query
			},
			headers: {
				Authorization: 'Bearer NG0TuV~u2ni#BP|'
			}
		})
			.then(function(response) {
				return response.hits;
			})
			.catch(function notifyError (error) {
				$mdToast.show(
					$mdToast.simple()
						.content(error.message)
						.hideDelay(3000)
				);
				return $q.reject(error);
			});
	};
}

angular
	.module('app')
	.service('locationService', LocationService);
