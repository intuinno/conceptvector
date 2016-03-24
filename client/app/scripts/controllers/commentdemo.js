'use strict';

/**
 * @ngdoc function
 * @name commentiqApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the commentiqApp
 */
angular.module('conceptvectorApp')
    .controller('CommentdemoCtrl', ['$scope', '$uibModal', '$log', '$routeParams', '$http', 'serverURL', function($scope, $uibModal, $log, $routeParams, $http, serverURL) {

        $scope.rankOrder = true;

        $scope.getScores = function(concept) {

            console.log(concept);

            var params = { 'conceptID': concept.id, 'articleID': $routeParams.articleId }

            $scope.loadingPromise = $http.get(serverURL + '/ConceptScores', { 'params': params }).success(function(data) {

                $scope.nomaData.forEach(function(d) { 
                    d.score = data.scores[d.commentID]; 
                });

            });
        };

        $scope.statusArray = ['New', 'Accepted', 'Rejected', 'Picked'];

        $scope.tabArray = [{
            status: 'New',
            active: true
        }, {
            status: 'Accepted'
        }, {
            status: 'Rejected'
        }, {
            status: 'Picked'
        }];



        $scope.settingName = 'New Setting';

        $scope.scoreModels = ['comment', 'user'];

        $scope.pickTags = ['well-written', 'informative', 'personal experience', 'critical', 'humorous'];


        $scope.presetCategory = [{
            name: 'Default',
            weights: {


                ArticleRelevance: 41.7050691338,
                AVGcommentspermonth: 11.3163696168,
                AVGBrevity: -8.44420731416,
                AVGPersonalXP: 10.6800123967,
                AVGPicks: 38.7413080958,
                AVGReadability: 69.9140232479,
                AVGRecommendationScore: 16.9226104916,
                Brevity: -65.7550166251,
                ConversationalRelevance: -56.8332353888,
                PersonalXP: 5.93998767753,
                Readability: 100.0,
                RecommendationScore: 100.0
            }
        }, {
            name: 'Personal Story',
            weights: {
                ArticleRelevance: 0,
                ConversationalRelevance: 0,
                AVGcommentspermonth: 0,
                AVGBrevity: 0,
                AVGPersonalXP: 0,
                AVGPicks: 0,
                AVGReadability: 0,
                AVGRecommendationScore: 0,
                Brevity: 60,
                PersonalXP: 50,
                Readability: 0,
                RecommendationScore: 0
            }
        }, {
            name: 'Unexpected comment',
            weights: {
                ArticleRelevance: 0,
                ConversationalRelevance: 0,
                AVGcommentspermonth: 0,
                AVGBrevity: 0,
                AVGPersonalXP: 0,
                AVGPicks: 40,
                AVGReadability: 0,
                AVGRecommendationScore: 40,
                Brevity: -100,
                PersonalXP: 0,
                Readability: 0,
                RecommendationScore: 40
            },
        }, {
            name: 'Written by best user',
            weights: {
                ArticleRelevance: 0,
                ConversationalRelevance: 0,
                AVGcommentspermonth: 0,
                AVGBrevity: 0,
                AVGPersonalXP: 0,
                AVGPicks: 90,
                AVGReadability: 30,
                AVGRecommendationScore: 90,
                Brevity: 0,
                PersonalXP: 0,
                Readability: 0,
                RecommendationScore: 0
            }
        }];

        var emptyCategory = {
            name: 'Temporary for Test',
            weights: {
                ArticleRelevance: 0,
                ConversationalRelevance: 0,
                AVGcommentspermonth: 0,
                AVGBrevity: 0,
                AVGPersonalXP: 0,
                AVGPicks: 0,
                AVGReadability: 0,
                AVGRecommendationScore: 0,
                Brevity: 0,
                PersonalXP: 0,
                Readability: 0,
                RecommendationScore: 0
            }
        };


        $scope.currentCategory = $scope.presetCategory[0];

        $scope.nomaData = [];
        $scope.isSettingCollapsed = true;

        $scope.nomaConfig = {

        };

        $scope.nomaRound = true;
        $scope.nomaBorder = false;
        $scope.nomaConfig.comment = false;
        $scope.nomaShapeRendering = 'auto';
        $scope.nomaConfig.isGather = 'gather';
        $scope.nomaConfig.relativeModes = [false, true];
        $scope.nomaConfig.relativeMode = 'absolute';
        $scope.nomaConfig.binSize = 10;
        $scope.nomaConfig.matrixMode = false;
        $scope.nomaConfig.xDim;
        $scope.nomaConfig.yDim;
        $scope.nomaConfig.isInteractiveAxis = false;
        $scope.isScatter = false;
        $scope.nomaConfig.lens = "noLens";
        $scope.isURLInput = false;
        $scope.context = {};
        $scope.context.translate = [0, 0];
        $scope.context.scale = 1;
        $scope.dimsumData = {};
        $scope.dimsum = {};
        $scope.dimsum.selectionSpace = [];
        $scope.filteredComment = [];


        $scope.nomaConfig.SVGAspectRatio = 1.4;

        $scope.overview = "map";

        var computeScoreComment = function(criteria, comment) {

            var score = criteria.weights.AR * comment.ArticleRelevance + criteria.weights.CR * comment.ConversationalRelevance + criteria.weights.personal * comment.PersonalXP + criteria.weights.readability * comment.Readability + criteria.weights.brevity * comment.Brevity + criteria.weights.recommend * comment.RecommendationScore;

            return score;
        };

        var computeScoreUser = function(criteria, comment) {

            var score = criteria.weights.userActivity * comment.AVGcommentspermonth + criteria.weights.userBrevity * comment.AVGBrevity + criteria.weights.userPicks * comment.AVGPicks + criteria.weights.userReadability * comment.AVGReadability + criteria.weights.userRecommend * comment.AVGRecommendationScore + criteria.weights.userPersonal * comment.AVGPersonalXP;

            return score;
        };

        var computeScore = function(currentCategory, comment) {

            var criterias = d3.keys(currentCategory.weights);

            var score = d3.sum(criterias, function(criteria) {

                return comment[criteria] * currentCategory.weights[criteria];

            });

            return score;
        };


        function updateCriteriaWeightTypes() {

            var p = $scope.currentCategory.weights;

            for (var key in p) {
                if (p.hasOwnProperty(key)) {
                    // alert(key + " -> " + p[key]);
                    p[key] = parseFloat(p[key]);
                }
            }
        };

        $scope.$watch(function() {
            return $scope.currentCategory;
        }, function(newVals, oldVals) {
            // debugger;

            updateCriteriaWeightTypes();
            updateScore();

        }, true);

        $scope.$watch(function() {
            return $scope.baseModel;
        }, function(newVals, oldVals) {
            // debugger;

            updateScore();

        }, true);

        var updateScore = function() {

            $scope.nomaData.forEach(function(d) {

                d.score = computeScore($scope.currentCategory, d);
            });


        };

        $scope.saveCurrentSetting = function() {

            var modalInstance = $uibModal.open({
                templateUrl: 'settingNameModal.html',
                controller: 'settingNameModalCtrl',
                size: 'sm',
                resolve: {
                    settingName: function() {
                        return $scope.currentCategory.name;
                    }
                }
            });

            modalInstance.result.then(function(settingName) {

                $log.info(settingName);

                var newSetting = angular.copy($scope.currentCategory);
                newSetting.name = settingName;

                $scope.presetCategory.push(newSetting);

            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.clearSetting = function() {


            $scope.currentCategory = angular.copy(emptyCategory);

        };

        $scope.openHelpModalForCriteria = function() {

            var modalInstance = $uibModal.open({
                templateUrl: 'helpCriteriaModalLoad.html',
                controller: 'HelpCriteriaModalCtrl',
                size: 'lg',
                resolve: {
                    criterias: function() {
                        return $scope.criterias;
                    }
                }
            });

        };

        $scope.acceptComment = function(comment) {

            comment.status = 'Accepted';

            // updateCommentStatus(comment.id, 'status', comment.status);


        };



        $scope.rejectComment = function(comment) {
            comment.status = 'Rejected';

            // updateCommentStatus(comment.id, 'status', comment.status);
        }




        $scope.pickReason = function(comment) {

            var modalInstance = $uibModal.open({
                templateUrl: 'pickReasonLoad.html',
                controller: 'PickReasonModalCtrl',
                size: 'sm',
                resolve: {
                    reasons: function() {
                        return $scope.pickTags;
                    }
                }
            });

            comment.status = 'Picked'

            modalInstance.result.then(function(result) {

                $log.info(result);

                comment.pickTags = result;

            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };


        $scope.loadData = function() {

            $scope.articleId = $routeParams.articleId;


            $scope.loadingPromise = $http.get(serverURL + '/articles/' + $routeParams.articleId).success(function(data) {
                var count = 0;
                // console.log(data);

                var tdata = data.comments;
                $scope.article = data.article;

                tdata.map(function(d) {
                    d.id = count;
                    count += 1;

                    // var randomNumber = Math.floor(Math.random() * $scope.statusArray.length);
                    d.status = 'New';
                    d.selected = true;

                    d.ApproveDateConverted = new Date(parseInt(d.createDate) * 1000);

                    d.commentTitle = d.commentTitle.replace(/<br\/>/g, "");
                    d.commentBody = d.commentBody.replace(/�/g, "");

                });


                $scope.nomaData = tdata;

                updateScore();

                $scope.nomaConfig.dims = d3.keys(tdata[0]);

                var index = $scope.nomaConfig.dims.indexOf('id');
                $scope.nomaConfig.dims.splice(index, 1);


                // index = $scope.nomaConfig.dims.indexOf('Name');
                // $scope.nomaConfig.dims.splice(index, 1);


                $scope.nomaConfig.xDim = '';
                $scope.nomaConfig.yDim = '';
                $scope.nomaConfig.colorDim = '';

                $scope.nomaConfig.isGather = '';
                $scope.nomaConfig.relativeMode = 'absolute';

                // $scope.$apply();

            });


            $http.get(serverURL + '/concepts').success(function(data) {

                console.log(data);
                $scope.criterias = data;

            });

        };

        $scope.loadData();


        $scope.itemlist = [{
            "name": "Average Comment Count",
            "value": "CommentCount"
        }, {
            "name": "Average Article Relevance",
            "value": "ArticleRelevance"
        }, {
            "name": "Average ConversationalRelevance",
            "value": "ConversationalRelevance"
        }, {
            "name": "Average Personal Experience",
            "value": "PersonalXP"
        }, {
            "name": "Average Readability",
            "value": "Readability"
        }, {
            "name": "Average Brevity",
            "value": "Brevity"
        }, {
            "name": "Average Recommendation",
            "value": "Recommendation"
        }]


        $scope.selectedItem = "CommentCount"

        $scope.select_criteria = "CommentCount"

        $scope.$watch('selectedItem', function(newValue, oldValue) {
            $scope.select_criteria = newValue
        })



    }]);