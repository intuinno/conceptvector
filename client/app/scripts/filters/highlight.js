'use strict';

/**
 * @ngdoc filter
 * @name conceptvectorApp.filter:highlight
 * @function
 * @description
 * # highlight
 * Filter in the conceptvectorApp.
 */
angular.module('conceptvectorApp')
    .filter('highlight', function($sce) {
        return function(input, keywords) {
            // console.log(input)
            // console.log(keywords)

            if (keywords) {

            	var separators = [',', ' ', '\\\.', '!', '<.+>', '\\\?', ';',':']

                var inputWords = input.split(new RegExp('(' + separators.join('|') + ')', 'g'));

                var inputData = inputWords.map(function(d) {
                    return { original: d, updated: d, isUpdated: false }
                });

                keywords.forEach(function(myKeyword) {
                    inputData.forEach(function(commentWord) {
                        if (commentWord.original.toLowerCase() === myKeyword.word && commentWord.isUpdated === false) {
                            if (myKeyword.key_type === 'positive') {
                                commentWord.updated = '<span class="highlightedPositive" uib-tooltip="Hello">' + commentWord.original + '</span>';
                            } else {
                                commentWord.updated = '<span class="highlightedNegative">' + commentWord.original + '</span>';
                            }
                            commentWord.isUpdated = true;
                        }
                    })
                });

                var output = inputData.map(function(d) {
                    return d.updated;
                }).join(" ");


                return $sce.trustAsHtml(output);
            }

            return input;


        };
    });
