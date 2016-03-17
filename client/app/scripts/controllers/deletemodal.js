'use strict';

/**
 * @ngdoc function
 * @name commentiqApp.controller:SettingNameModalCtrl
 * @description
 * # SettingNameModalCtrl
 * Controller of the commentiqApp
 */
angular.module('conceptvectorApp')
  .controller('deleteModalCtrl', function($scope, $uibModalInstance, conceptName) {

  $scope.conceptName = conceptName;
  
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
