'use strict';

/**
 * @ngdoc function
 * @name conceptvectorApp.controller:CustomconceptCtrl
 * @description
 * # CustomconceptCtrl
 * Controller of the conceptvectorApp
 */
angular.module('conceptvectorApp')
    .controller('CustomconceptCtrl', ['$scope', 'AutoComplete', 'recommend', function($scope, AutoComplete, recommend) {
        // $scope.concept_type = 'bipolar';
        $scope.positiveTags = [];
        $scope.negativeTags = [];
        $scope.positiveRecommendation = [];
        $scope.negativeRecommendation = [];

        $scope.loadTags = function(query) {
            return AutoComplete.load(query);
        };

        $scope.tagChanged = function() {
            // console.log($scope.positiveTags);
            // console.log($scope.negativeTags);
            // ConceptVector.getRecommend($scope.positiveTags, $scope.negativeTags);

            var positiveTags = $scope.positiveTags.map(function(d) {
                return d['text'];
            });

            var negativeTags = $scope.negativeTags.map(function(d) {
                return d['text'];
            })
            recommend.save({
                'positiveWords': positiveTags,
                'negativeWords': negativeTags
            }, function(entry) {
                console.log(entry);

                $scope.positiveRecommendation = entry.positiveRecommend;
                $scope.negativeRecommendation = entry.negativeRecommend;

            });

        };

        $scope.addPositive = function(word) {

            $scope.positiveTags.push({
                'text': word
            });
            $scope.tagChanged();

        };

        $scope.addNegative = function(word) {

            $scope.negativeTags.push({
                'text': word
            });
            $scope.tagChanged();

        };

    }]);
