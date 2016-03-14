'use strict';

/**
 * @ngdoc function
 * @name conceptvectorApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the conceptvectorApp
 */
angular.module('conceptvectorApp')
    .controller('RegisterCtrl', ['$scope', '$location', 'AuthService',
        function($scope, $location, AuthService) {

            $scope.register = function() {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                // call register from service
                AuthService.register($scope.registerForm.name,
                		$scope.registerForm.email,
                        $scope.registerForm.password)
                    // handle success
                    .then(function(e) {
                        $location.path('/login');
                        $scope.disabled = false;
                        $scope.registerForm = {};
                    })
                    // handle error
                    .catch(function(e) {
                        $scope.error = true;
                        $scope.errorMessage = e.result;
                        $scope.disabled = false;
                        $scope.registerForm = {};
                    });

            };

        }
    ]);
