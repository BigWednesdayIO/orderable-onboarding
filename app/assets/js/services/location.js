function LocationService ($http, API) {
	var service = this;

	service.search = function(query) {
		return $http({
			method: 'POST',
			url: API.location_search,
			data: {
				query: query
			}
		})
			.then(function(response) {
				return response.hits;
			});
	};
}

angular
	.module('app')
	.service('locationService', LocationService);
