function LocationService ($http, $filter) {
	var service = this;

	service.search = function(query) {
		return $http({
			method: 'GET',
			url: 'mocks/uk-towns.json',
			cache: true
		})
			.then(function(response) {
				return $filter('filter')(response, query);
			});
	};
}

angular
	.module('app')
	.service('locationService', LocationService);
