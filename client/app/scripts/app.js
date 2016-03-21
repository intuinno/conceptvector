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
    'nvd3',
    'angularUtils.directives.dirPagination',
    'ui.select'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        access: {restricted: false}
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about',
        access: {restricted: false}
      })
      .when('/customConcept', {
        templateUrl: 'views/customconcept.html',
        controller: 'CustomconceptCtrl',
        controllerAs: 'customConcept',
        access: {restricted: true}
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        access: {restricted: false}
      })
      .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'LogoutCtrl',
        access: {restricted: true}
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        access: {restricted: false}
      })
      .when('/concepts', {
        templateUrl: 'views/conceptlist.html',
        controller: 'ConceptlistCtrl',
        access: {restricted: false}
      })
      .when('/concepts/:conceptId', {
        templateUrl: 'views/customconcept.html',
        controller: 'ConceptdetailCtrl',
      })
      .when('/commentiq', {
        templateUrl: 'views/commentiq.html',
        controller: 'CommentiqCtrl',
      })
      .when('/commentdemo', {
        templateUrl: 'views/commentdemo.html',
        controller: 'CommentdemoCtrl',
      })
      .when('/articles', {
        templateUrl: 'views/articles.html',
        controller: 'ArticlesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    AuthService.getUserStatus();

    if (!next.access) {
      return;
    } 
    if (next.access.restricted && (AuthService.isLoggedIn() === false)) {
      $location.path('/login');
      $route.reload();
    }
  });
});
