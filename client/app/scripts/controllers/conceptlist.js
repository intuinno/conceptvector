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

        var loadConcepts = function() {
            $http.get(serverURL + '/concepts')
                // handle success
                .success(function(data) {
                    console.log(data);

                    $scope.concepts = data;
                    // $scope.$apply();
                })
                // handle error
                .error(function(data) {
                    console.log(data);
                });

        };


        $scope.isOwner = function(concept) {

            if (AuthService.isLoggedIn()) {

                if (AuthService.getUserId() === concept.creator_id) {
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
                        return concept.name;
                    }
                }
            });

            modalInstance.result.then(function() {

                $http.get(serverURL + '/concept_delete/' + concept.id)
                    // handle success
                    .success(function(data) {

                        $scope.concepts = data;
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

        $scope.clone = function(concept) {

            var modalInstance = $uibModal.open({
                templateUrl: 'cloneModal.html',
                controller: 'cloneModalCtrl',
                size: 'sm',
                resolve: {
                    conceptName: function() {
                        return concept.name;
                    }
                }
            });

            modalInstance.result.then(function(newConceptName) {

                var newConcept = {};

                newConcept = angular.copy(concept);

                newConcept.name = newConceptName;

                $http.post(serverURL + '/concepts', newConcept)
                    // handle success
                    .success(function(data) {
                        console.log(data);

                        // $scope.concepts = data.data;
                        // $scope.$apply();
                        loadConcepts();

                    })
                    // handle error
                    .error(function(data) {
                        console.log(data);
                    });


            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });

        };

        loadConcepts();


    }]);

angular.module('conceptvectorApp')
    .controller('cloneModalCtrl', function($scope, $uibModalInstance, conceptName) {

        $scope.conceptName = 'Copy of ' + conceptName;

        $scope.ok = function() {
            $uibModalInstance.close($scope.conceptName);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
