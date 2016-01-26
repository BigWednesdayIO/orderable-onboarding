angular
	.module('app')
	.constant('externalLinks', [
		{
			attribute: 'facebook',
			prefix: 'https://facebook.com/',
			placeholder: 'your.facebook.page',
			icon: 'facebook-official'
		}, {
			attribute: 'twitter',
			prefix: '@',
			placeholder: 'your_username',
			icon: 'twitter'
		}, {
			attribute: 'website',
			type: 'url',
			placeholder: 'http://your-website.com',
			icon:'link'
		}
	]);
