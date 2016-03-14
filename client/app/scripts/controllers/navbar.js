'use strict';

/**
 * @ngdoc function
 * @name conceptvectorApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the conceptvectorApp
 */
angular.module('conceptvectorApp')
    .controller('NavbarCtrl', ['$scope', '$location', 'AuthService',
        function($scope, $location, AuthService) {

            $scope.logout = function() {

                // call logout from service
                AuthService.logout()
                    .then(function() {
                        $location.path('/');
                    });

            };

            $scope.isLoggedIn = function() {
                return AuthService.isLoggedIn();

            };

            $scope.getUserName = function() {
            	return AuthService.getUserName();
            }

        }
    ]);
