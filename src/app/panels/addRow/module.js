define([
		'angular',
		'app',
		'underscore',
		'moment',
		'kbn'
	],
	function (angular, app, _, moment, kbn) {
		'use strict';

		var module = angular.module('kibana.panels.addRow', []);
		app.useModule(module);

		module.controller('addRow', function ($scope, $http, alertSrv, $rootScope) {
			$scope.panelMeta = {
				status: "Stable",
				description: "A panel for adding new graphs."
			};

			$scope.add_row = function (category, rowTitle) {
				var dashboard = angular.copy($scope.dashboard);
				if (rowTitle.indexOf('(') > 0) {
					rowTitle = rowTitle.substring(0, rowTitle.indexOf('('));
				}
				var rowId = rowTitle.trim().replace(/ /g, '_').toLowerCase();
				var categoryId = category.replace(/ /g, '_').toLowerCase();
				$rootScope.$emit('$routeChangeSuccess');
				return $http({
					url: "/grafana/app/dashboards/graphs/" + categoryId + "/" + rowId + '.json?' + new Date().getTime(),
					method: "GET"
				}).then(function (result) {
					if (!result) {
						return false;
					}
					dashboard.current.rows.unshift(result.data);
					dashboard.dash_load(dashboard.current);
					dashboard.to_server();
				}, function () {
					alertSrv.set('Error', "Could not load <em>" + rowTitle + "</em>.", 'error');
					return false;
				});
			};
		});
	});
