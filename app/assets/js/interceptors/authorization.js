function AuthorizationInterceptor (baseAPI, browserStorage) {
	return {
		request: function(config) {
			if (config.url.match(baseAPI) && !config.headers['Authorization']) {
				config.headers['Authorization'] = browserStorage.getItem('token');
			}
			return config;
		}
	};
}

angular
	.module('app')
	.factory('AuthorizationInterceptor', AuthorizationInterceptor);
