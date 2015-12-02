function DashboardController ($stateParams, setupSteps) {
	var vm = this;

	vm.first = !!$stateParams.first;

	vm.steps = setupSteps.pending;
	vm.completed = setupSteps.completed;
}

DashboardController.resolve = /* @ngInject */ {
	setupSteps: function(setupStepsService) {
		return setupStepsService
			.getSetupSteps();
	}
};

angular
	.module('app')
	.controller('DashboardController', DashboardController);
