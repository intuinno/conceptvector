'use strict';

/**
 * @ngdoc directive
 * @name conceptvectorApp.directive:dirhighlight
 * @description
 * # dirhighlight
 */
angular.module('conceptvectorApp')
    .directive('dirhighlight', function($compile) {
        return {
            restrict: 'E',
            scope: {
                keywords: '=',
                dynamicTooltip: '@',
                input: '='
            },
            link: function postLink(scope, element, attrs) {

                scope.$watch('keywords', function(keywords) {

                    if (keywords) {

                        var separators = [',', ' ', '\\\.', '!', '<.+>', '\\\?', ';', ':']

                        var inputWords = scope.input.split(new RegExp('(' + separators.join('|') + ')', 'g'));

                        var inputData = inputWords.map(function(d) {
                            return { original: d, updated: d, isUpdated: false }
                        });

                        keywords.forEach(function(myKeyword) {
                            inputData.forEach(function(commentWord) {
                                if (commentWord.original.toLowerCase() === myKeyword.word && commentWord.isUpdated === false) {
                                    if (myKeyword.key_type === 'positive') {

                                    	var myTooltip = "Positive\nScore: " + myKeyword.score;

                                        commentWord.updated = '<span class="highlightedPositive" tooltip-placement="top" uib-tooltip="' + myTooltip + '">' + commentWord.original + '</span>';
                                    } else {
                                        commentWord.updated = '<span class="highlightedNegative">' + commentWord.original + '</span>';

                                        var myTooltip = "Negative\nScore: " + myKeyword.score;

                                        commentWord.updated = '<span class="highlightedNegative" tooltip-placement="top" uib-tooltip="' + myTooltip + '">' + commentWord.original + '</span>';
                         

                                    }
                                    commentWord.isUpdated = true;
                                }
                            })
                        });

                        var output = inputData.map(function(d) {
                            return d.updated;
                        }).join(" ");
                        
                        element.html(output);

                        $compile(element.contents())(scope);
                    } else {

                    	element.html(scope.input);
                    	$compile(element.contents())(scope);
                    }



                });

            }
        };
    });
