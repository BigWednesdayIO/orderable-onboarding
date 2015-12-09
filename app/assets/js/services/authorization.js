function AuthenticationService (browserStorage) {
	var service = this;

	service.isAuthenticated	= function() {
		return !!browserStorage.getItem('supplier_id');
	};
}

angular
	.module('app')
	.service('authenticationService', AuthenticationService);
