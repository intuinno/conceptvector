'use strict';

/**
 * @ngdoc overview
 * @name conceptvectorApp
 * @description
 * # conceptvectorApp
 *
 * Main module of the application.
 */
angular
  .module('conceptvectorApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ngTagsInput',
    'nvd3'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/customConcept', {
        templateUrl: 'views/customconcept.html',
        controller: 'CustomconceptCtrl',
        controllerAs: 'customConcept'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
