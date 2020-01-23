'use strict';

/**
 * @ngdoc service
 * @name conceptvectorApp.AuthService
 * @description
 * # AuthService
 * Factory in the conceptvectorApp.
 */
angular.module('conceptvectorApp')
    .factory('AuthService', ['$q', '$timeout', '$http', 'serverURL', function($q, $timeout, $http, serverURL) {
        // Service logic
        // ...

        var user = null;
        var userName;
        var userId;

        function isLoggedIn() {
            if (user) {
                return true;
            } else {
                return false;
            }
        }

        function getUserName() {
            if (user) {
                return userName;
            } else {
                return '';
            }
        }

        function getUserId() {
            if (user) {
                return userId;
            } else {
                return '';
            }
        }

        function getUserStatus() {
            $http.get(serverURL + '/status',{withCredentials: true, contentType : "application/json"})
                // handle success
                .success(function(data) {
                    if (data.status) {
                        user = true;
                        userName = data.userName;
                        userId = data.user;
                    } else {
                        user = false;
                        userName = '';
                        userId = '';
                    }
                })
                // handle error
                .error(function(data) {
                    user = false;
                    userName = '';
                });
        }

        function login(email, password) {

            var deferred = $q.defer();

            $http.post(serverURL + '/login', { email: email, password: password }, {withCredentials: true, contentType : "application/json"})
                .success(function(data, status) {
                    console.log("Logged in returned")
                    if (status === 200 && data.result) {
                        console.log(data)
                        user = true;
                        userName = data.name;
                        deferred.resolve();
                    } else {
                        user = false;
                        deferred.reject();
                    }
                })
                .error(function(data) {
                    user = false;
                    deferred.reject();
                });

            return deferred.promise;

        }

        function logout() {
            var deferred = $q.defer();

            $http.get(serverURL + '/logout', {withCredentials: true, contentType : "application/json"})
                .success(function(data) {
                    user = false;
                    deferred.resolve();
                })
                .error(function(data) {
                    user = false;
                    deferred.reject();
                });

            return deferred.promise;
        }

        function register(name, email, password) {
            var deferred = $q.defer();

            $http.post(serverURL + '/register', { name: name, email: email, password: password }, {withCredentials: true, contentType : "application/json"})
                .success(function(data, status) {
                    if (status === 200 && data.result === 'success') {
                        deferred.resolve();
                    } else {
                        deferred.reject(data, status);
                    }
                });

            return deferred.promise;

        }

        // Public API here
        return {
            getUserName: getUserName,
            isLoggedIn: isLoggedIn,
            login: login,
            logout: logout,
            register: register,
            getUserStatus: getUserStatus,
            getUserId: getUserId
        };



    }]);
