function AuthenticationService ($q, browserStorage) {
	var service = this;

	service.isAuthenticated	= function() {
		return !!browserStorage.getItem('supplier_id');
	};

	service.signOut = function() {
		return $q.when(browserStorage.clear());
	}
}

angular
	.module('app')
	.service('authenticationService', AuthenticationService);
