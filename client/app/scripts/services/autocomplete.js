'use strict';

/**
 * @ngdoc service
 * @name conceptvectorApp.AutoComplete
 * @description
 * # AutoComplete
 * Service in the conceptvectorApp.
 */
angular.module('conceptvectorApp')
    .service('AutoComplete', ['$resource', '$q', function($resource, $q) {
        //   // AngularJS will instantiate a singleton by calling "new" on this function
        //   return $resource('http://127.0.0.1:5000/QueryAutoComplete/:word', {word: '@_word'});
        // }

        var serverURL = 'http://127.0.0.1:5000/QueryAutoComplete';

        var AutoComplete = $resource(serverURL + '/:word', {
            word: '@word'
        });

        this.load = function(query) {

            var deferred = $q.defer();

            AutoComplete.get({
                    word: query
                },
                function sucess(entry) {

                    if (entry.success = true) {

                        deferred.resolve(entry.word);
                    }
                },
                function error() {
                    console.log('AutoComplete error');
                });

            return deferred.promise;
        };
    }]);
