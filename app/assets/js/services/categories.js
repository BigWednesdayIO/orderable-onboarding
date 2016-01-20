function CategoriesService ($http, $q, API, _) {
	var service = this;

	function getCategories () {
		return $http({
			url: API.categories,
			method: 'GET',
			cache: true
		})
	}

	function getIdsFromChain (idChain) {
		return idChain.split('.');
	}

	service.getCategoryNames = function() {
		return getCategories()
			.then(function(categories) {
				return _.mapValues(categories, function(category) {
					return category.name;
				});
			});
	};

	service.getNameForCategory = function(idChain) {
		var ids = getIdsFromChain(idChain),
			id = ids[ids.length - 1];

		return service
			.getCategoryNames()
			.then(function(categories) {
				return categories[id];
			});
	};

	service.getFullId = function(id) {
		return getCategories()
			.then(function(categories) {
				return categories[id].hierachy;
			});
	};

	service.getHierarchyForCategory = function(idChain) {
		var ids = getIdsFromChain(idChain);

		var namePromises = ids.map(function(id) {
			return service
				.getNameForCategory(id);
		});

		return $q.all(namePromises)
			.then(function(names) {
				return names.map(function(name, index) {
					return {
						id: ids.slice(0, index + 1).join('.'),
						name: name
					};
				});
			});
	};

	function getDirectChildren (categories, id) {
		var isDirectChild;

		id = id && id.replace(/\./g, '\\.') + '\\.';

		isDirectChild = new RegExp('^' + (id ? id : '') + '[0-9]+$')

		return _(categories)
			.map(function(value, key) {
				value.code = key;
				return value;
			})
			.filter(function(category) {
				return isDirectChild.test(category.hierachy);
			})
			.sortBy('name')
			.value();
	}

	service.getChildCategories = function(id) {
		return getCategories()
			.then(function(categories) {
				return getDirectChildren(categories, id)
					.map(function(category) {
						category.hasChildren = !!getDirectChildren(categories, category.hierachy).length;
						return category;
					});
			});
	};

	service.suggestCategoryForProduct = function(product) {
		return $http({
			url: API.search,
			method: 'POST',
			data: {
				query: product.name
			},
			headers: {
				Authorization: 'Bearer NG0TuV~u2ni#BP|'
			}
		})
			.then(function(response) {
				var categories = _.find(response.facets, {field: 'category_code'});

				if (!categories || !categories.values.length) {
					return;
				};

				return categories.values[0].value;
			});
	};
}

angular
	.module('app')
	.service('categoriesService', CategoriesService);
