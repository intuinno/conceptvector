'use strict';

/**
 * @ngdoc service
 * @name conceptvectorApp.serverURL
 * @description
 * # serverURL
 * Constant in the conceptvectorApp.
 */
angular.module('conceptvectorApp')
// When in Development
 .constant('serverURL', 'http://localhost:9000/api');
// When in Deployment
//   .constant('serverURL', 'http://conceptvector.org/api');
