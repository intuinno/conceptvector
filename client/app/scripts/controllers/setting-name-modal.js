'use strict';

/**
 * @ngdoc function
 * @name commentiqApp.controller:SettingNameModalCtrl
 * @description
 * # SettingNameModalCtrl
 * Controller of the commentiqApp
 */
angular.module('conceptvectorApp')
  .controller('settingNameModalCtrl', function($scope, $uibModalInstance, settingName) {

  $scope.settingName = 'Copy of ' + settingName;
  
  $scope.ok = function () {
    $uibModalInstance.close($scope.settingName);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

