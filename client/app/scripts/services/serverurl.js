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
.constant('serverURL', 'http://127.0.0.1:5000/api'); //.constant('serverURL', 'http://0.0.0.0:9000/api');
// When in Deployment
  //  .constant('serverURL', 'http://conceptvector.org/api');
