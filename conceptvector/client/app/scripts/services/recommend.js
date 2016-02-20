'use strict';

/**
 * @ngdoc service
 * @name conceptvectorApp.recommend
 * @description
 * # recommend
 * Factory in the conceptvectorApp.
 */
angular.module('conceptvectorApp')
    .factory('recommend', ['$resource', 'serverURL', function($resource, serverURL) {
        // Service logic
        // ...

        var apiURL = serverURL + '/RecommendWords';

        // Public API here
        return $resource(apiURL);
    }]);
