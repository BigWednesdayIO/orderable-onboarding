function AppearanceService ($http, $q) {
	var service = this;

	service.pickAtRandom = function(set) {
		return set[Math.floor(Math.random() * set.length)];
	};

	service.getColours = function() {
		return $http({
			method: 'GET',
			url: 'mocks/material-colours.json',
			cache: true
		});
	};

	service.getBanners = function() {
		return $http({
			method: 'GET',
			url: 'mocks/banners.json',
			cache: true
		});
	};

	service.pickInitials = function(supplier) {
		var name = supplier.name.split(' ');
		if (name.length === 1) {
			return name[0].substring(0, 2);
		}

		return name
			.map(function(word) {
				return word[0];
			})
			.slice(0, 2)
			.join('');
	};

	service.createRandomAppearance = function(supplier) {
		var appearance = {};

		appearance.initials = service.pickInitials(supplier);

		return $q.all([
			service
				.getColours(),
			service
				.getBanners()
		])
			.then(function(response) {
				var colours = response[0];
				var banners = response[1];

				appearance.colour = service.pickAtRandom(colours).value;
				appearance.banner_image = service.pickAtRandom(banners);

				return appearance;
			});
	};
}

angular
	.module('app')
	.service('appearanceService', AppearanceService);
