'use strict';

/**
 * @ngdoc function
 * @name conceptvectorApp.controller:CustomconceptCtrl
 * @description
 * # CustomconceptCtrl
 * Controller of the conceptvectorApp
 */
angular.module('conceptvectorApp')
    .controller('CustomconceptCtrl', ['$scope', 'AutoComplete', function($scope, AutoComplete) {
        // $scope.concept_type = 'bipolar';

        $scope.loadTags = function(query) {
           return AutoComplete.load(query);
        };

    }]);
