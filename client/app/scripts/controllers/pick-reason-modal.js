'use strict';

/**
 * @ngdoc function
 * @name commentiqApp.controller:PickReasonModalCtrl
 * @description
 * # PickReasonModalCtrl
 * Controller of the commentiqApp
 */
angular.module('conceptvectorApp')
  .controller('PickReasonModalCtrl', function($scope, $uibModalInstance, reasons) {

  $scope.reasons = reasons;
  $scope.result = {};
  
  $scope.ok = function () {
    $uibModalInstance.close($scope.result);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

