'use strict';

/**
 * @ngdoc function
 * @name conceptvectorApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the conceptvectorApp
 */
angular.module('conceptvectorApp')
    .controller('LoginCtrl', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {

        $scope.login = function() {

            // initial values
            $scope.error = false;
            $scope.disabled = true;

            // call login from service
            AuthService.login($scope.loginForm.email, $scope.loginForm.password)
                // handle success
                .then(function() {
                    $location.path('/');
                    $scope.disabled = false;
                    $scope.loginForm = {};
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Invalid username and/or password";
                    $scope.disabled = false;
                    $scope.loginForm = {};
                });

        };
    }]);
