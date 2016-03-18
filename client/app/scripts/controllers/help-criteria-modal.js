'use strict';

/**
 * @ngdoc function
 * @name commentiqApp.controller:HelpCriteriaModalCtrl
 * @description
 * # HelpCriteriaModalCtrl
 * Controller of the commentiqApp
 */
angular.module('conceptvectorApp')
  .controller('HelpCriteriaModalCtrl', function($scope, $uibModalInstance, criterias) {

  $scope.criterias = criterias;
  
  $scope.ok = function () {
    $uibModalInstance.close();
  };

});

