function CompaniesHouseService ($http) {
	var service = this;

	service.search = function(query) {
		return $http({
			method: 'GET',
			url: 'https://api.companieshouse.gov.uk/search/companies',
			headers: {
				Authorization: 'Basic Z1ZaZGktS2Fmcll2WDdqQlF5WmNsRm1IVXM5MWhFcDRvVndLcTJiSTo='
			},
			params: {
				q: query,
			}
		})
			.then(function(response) {
				return response.items.filter(function(company) {
					return company.company_status === 'active';
				});
			});
	}
}

angular
	.module('app')
	.service('companiesHouseService', CompaniesHouseService);
