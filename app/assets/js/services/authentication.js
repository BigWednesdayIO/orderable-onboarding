function AuthenticationService ($rootScope, $http, $q, API, displayError, browserStorage) {
	var service = this;
	var session = {};

	function storeSessionInfo (info) {
		session.id = info.id;
		session.token = info.token;
		browserStorage.setItem('supplier_id', info.id);
		browserStorage.setItem('token', info.token);
		return info;
	}

	service.getSessionInfo = function() {
		return {
			id: session.id || (session.id = browserStorage.getItem('supplier_id')),
			token: session.token || (session.token = browserStorage.getItem('token'))
		};
	};

	service.isAuthenticated	= function() {
		var info = service.getSessionInfo();
		return info.id && info.token && true;
	};

	service.signIn = function(credentials) {
		return $http({
			method: 'POST',
			url: API.suppliers + '/authenticate',
			data: credentials
		})
			.then(storeSessionInfo)
			.catch(displayError);
	};

	service.signOut = function() {
		session = {};
		$rootScope.isSignedIn = false;
		return $q.when(browserStorage.clear());
	};

	return service;
}

angular
	.module('app')
	.factory('authenticationService', AuthenticationService);
