'use strict';

/**
 * @ngdoc function
 * @name conceptvectorApp.controller:ConceptlistCtrl
 * @description
 * # ConceptlistCtrl
 * Controller of the conceptvectorApp
 */
angular.module('conceptvectorApp')
    .controller('ConceptlistCtrl', ['$scope', '$http', 'serverURL', 'AuthService', '$uibModal', function($scope, $http, serverURL, AuthService, $uibModal) {

        $scope.concepts = ['hello'];
        $scope.currentPage = 1;
        $scope.pageSize = 10;

        $scope.concepts = [];

        $http.get(serverURL + '/concepts')
            // handle success
            .success(function(data) {
                console.log(data);

                $scope.concepts = data.data;
                // $scope.$apply();
            })
            // handle error
            .error(function(data) {
                console.log(data);
            });


        $scope.isOwner = function(concept) {

            if (AuthService.isLoggedIn()) {

                if (AuthService.getUserId() === concept.attributes.creator_id) {
                    return true;
                }
            }

            return false;

        };

        $scope.delete = function(concept) {

            var modalInstance = $uibModal.open({
                templateUrl: 'deleteModal.html',
                controller: 'deleteModalCtrl',
                size: 'sm',
                resolve: {
                    conceptName: function() {
                        return concept.attributes.name;
                    }
                }
            });

            modalInstance.result.then(function() {

                $http.delete(serverURL + '/concepts/' + concept.id)
                    // handle success
                    .success(function(data) {
                        console.log(data);

                        $scope.concepts = data.data;
                        // $scope.$apply();
                    })
                    // handle error
                    .error(function(data) {
                        console.log(data);
                    });

            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });

        };


    }]);
