function LocationService ($http, API) {
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
			});
	};
}

angular
	.module('app')
	.service('locationService', LocationService);
