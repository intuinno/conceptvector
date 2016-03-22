'use strict';

/**
 * @ngdoc function
 * @name commentiqApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the commentiqApp
 */
angular.module('conceptvectorApp')
    .controller('CommentdemoCtrl', ['$scope', '$uibModal', '$log', '$routeParams', function($scope, $uibModal, $log, $routeParams) {

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

        $scope.articleId = $routeParams.articleId;

        $http.get(serverURL + '/articles/' + $routeParams.articleId).success(function(data) {
            console.log(data);
            // $scope. = data.data.attributes;
            $scope.concept_name = $scope.concept.name;
            $scope.concept_type = $scope.concept.concept_type;
            $scope.positiveTags = $scope.concept.input_terms.positive;
            $scope.negativeTags = $scope.concept.input_terms.negative;

            $scope.tagChanged();



        });

        $scope.settingName = 'New Setting';

        $scope.scoreModels = ['comment', 'user'];

        $scope.pickTags = ['well-written', 'informative', 'personal experience', 'critical', 'humorous'];

        $scope.criterias = [{
            name: 'ArticleRelevance',
            display_text: "Article Relevance",
            help_text: "This score represents how relevant a comment is with respect to the article. Relevance is measured by looking at the use of similar words. ",
            model: "comment"
        }, {
            name: 'ConversationalRelevance',
            display_text: "Conversational Relevance",
            help_text: "This score represents how relevant a comment is with respect to preceding comments.  Relevance is measured by looking at the use of similar words. ",
            model: "comment"
        }, {
            name: 'AVGcommentspermonth',
            display_text: "User Comments per Month",
            help_text: "This score represents the average number of comments per month a user has written.",
            model: "user"
        }, {
            name: 'AVGBrevity',
            display_text: "User Length",
            help_text: "This score represents the average brevity score for a user across their entire history. ",
            model: "user"
        }, {
            name: 'AVGPersonalXP',
            display_text: "User Personal Experience",
            help_text: "This score represents the average personal experience score for a user across their entire history. ",
            model: "user"
        }, {
            name: 'AVGPicks',
            display_text: "User Picks",
            help_text: "This score represents the average rate at which a user’s comments are selected as NYT Picks ",
            model: "user"
        }, {
            name: 'AVGReadability',
            display_text: "User Readability",
            help_text: "This score represents the average readability score for a user across their entire history.",
            model: "user"
        }, {
            name: 'AVGRecommendationScore',
            display_text: "User Recommendation Score",
            help_text: "This score represents the average recommendation score for a user across their entire history.  ",
            model: "user"
        }, {
            name: 'Brevity',
            display_text: "Length of comments",
            help_text: "This score represents how short a comment is, measured in terms of the number of words. ",
            model: "comment"
        }, {
            name: 'PersonalXP',
            display_text: "Personal Experience",
            help_text: "This score is a measure of the rate of use of words in Linguistic Inquiry and Word Count (LIWC) categories “I”, “We”, “Family”, and “Friends” which reflect personal (1st and 3rd person pronouns) and close relational (family and friends) references.",
            model: "comment"
        }, {
            name: 'Readability',
            display_text: "Readability of the comment",
            help_text: "This score represents how readable a comment is, according to a standard index of reading grade level. ",
            model: "comment"
        }, {
            name: 'RecommendationScore',
            display_text: "Recommendation Score",
            help_text: "This score represents how many recommendations a comment has received.",
            model: "comment"
        }];


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
        $scope.nomaConfig.isGather = 'scatter';
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


        $scope.$watch(function() {
            return $scope.nomaConfig.xDim;
        }, function(newVals, oldVals) {
            $scope.xAxisExplanation = findExplantion($scope.nomaConfig.xDim);

            // $scope.$apply();

        }, true);

        $scope.$watch(function() {
            return $scope.nomaConfig.yDim;
        }, function(newVals, oldVals) {
            $scope.yAxisExplanation = findExplantion($scope.nomaConfig.yDim);
            // $scope.$apply();

        }, true);

        $scope.$watch(function() {
            return $scope.tempoDim;
        }, function(newVals, oldVals) {
            $scope.tempoDimExplanation = findExplantion($scope.tempoDim);
            // $scope.$apply();

        }, true);

        var findExplantion = function(dimName) {
            var filtered = $scope.criterias.filter(function(d) {
                return d.name === dimName ? true : false;
            });

            if (filtered.length === 0) {

                return 'undefined';
            } else {

                return filtered[0];
                $
            }
        }

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

            d3.csv('data/article1.csv', function(error, tdata) {
                var count = 0;

                tdata.map(function(d) {
                    d.id = count;
                    count += 1;

                    // var randomNumber = Math.floor(Math.random() * $scope.statusArray.length);
                    d.status = 'New';
                    d.selected = true;

                    d.ApproveDateConverted = parseInt(d.ApproveDate.replace(/,/g, ''));

                    // console.log(d.commentBody);

                    d.commentBody = d.commentBody.replace(/\\/g, "");
                    d.commentBody = d.commentBody.replace(/�/g, "");




                });


                $scope.nomaData = tdata;

                updateScore();

                $scope.nomaConfig.dims = d3.keys(tdata[0]);

                var index = $scope.nomaConfig.dims.indexOf('id');
                $scope.nomaConfig.dims.splice(index, 1);


                // index = $scope.nomaConfig.dims.indexOf('Name');
                // $scope.nomaConfig.dims.splice(index, 1);


                $scope.nomaConfig.xDim = 'ArticleRelevance';
                $scope.nomaConfig.yDim = 'PersonalXP';
                $scope.nomaConfig.colorDim = 'status';

                $scope.nomaConfig.isGather = 'scatter';
                $scope.nomaConfig.relativeMode = 'absolute';

                $scope.$apply();

            });

        };

        $scope.loadData();

        $scope.article = '<p class=\”story-body-text story-content\” data-para-count=\”323\” data-total-count=\”323\” itemprop=\”articleBody\” id=\”story-continues-1\”>WASHINGTON — The F.B.I. director, James B. Comey, delivered an <a title=\”Video of the speech.\” href=\”https://www.youtube.com/watch?v=sbx4HAm6Rc8\”>unusually candid speech</a> on Thursday about the difficult relationship between the police and African-Americans, saying that officers who work in neighborhoods where blacks commit crimes at a high rate develop a cynicism that shades their attitudes about race.</p><p class=\”story-body-text story-content\” data-para-count=\”468\” data-total-count=\”791\” itemprop=\”articleBody\”>Citing the song \”<a title=\”Video.\” href=\”https://www.youtube.com/watch?v=tbud8rLejLM\”>Everyone\’s a Little Bit Racist</a>\” from the Broadway show \”Avenue Q,\” he said police officers of all races viewed black and white men differently. In an address to students at Georgetown University, Mr. Comey said that some officers scrutinize African-Americans more closely using a mental shortcut that \”becomes almost irresistible and maybe even rational by some lights\” because black men are arrested at much higher rates than white men.</p><p class=\”story-body-text story-content\” data-para-count=\”331\” data-total-count=\”1122\” itemprop=\”articleBody\” id=\”story-continues-2\”>In speaking about racial issues at such length, Mr. Comey used his office in a way that none of his predecessors had. His remarks also went beyond what President Obama and Attorney General Eric H. Holder Jr. have said since an unarmed black teenager, Michael Brown, was killed by a white police officer in Ferguson, Mo., in August.</p><p class=\”story-body-text story-content\” data-para-count=\”277\” data-total-count=\”1399\” itemprop=\”articleBody\”>Mr. Comey said that his speech, which was well received by law enforcement officials, was motivated by his belief that the country had not \”had a healthy dialogue\” since the protests began in Ferguson and that he did not \”want to see those important issues drift away.\”</p><p class=\”story-body-text story-content\” data-para-count=\”272\” data-total-count=\”1671\” itemprop=\”articleBody\”>Previous F.B.I. directors had limited their public comments about race to civil rights investigations, like murders committed by the Ku Klux Klan and the bureau\’s wiretapping of the Rev. Dr. Martin Luther King Jr. But Mr. Comey tried to dissect the issue layer by layer.</p><p class=\”story-body-text story-content\” data-para-count=\”92\” data-total-count=\”1763\” itemprop=\”articleBody\”>He started by acknowledging that law enforcement had a troubled legacy when it came to race.</p><p class=\”story-body-text story-content\” data-para-count=\”269\” data-total-count=\”2032\” itemprop=\”articleBody\”>\”All of us in law enforcement must be honest enough to acknowledge that much of our history is not pretty,\” he said. \”At many points in American history, law enforcement enforced the status quo, a status quo that was often brutally unfair to disfavored groups.\”</p><p class=\”story-body-text story-content\” data-para-count=\”223\” data-total-count=\”2255\” itemprop=\”articleBody\”>Mr. Comey said there was significant research showing that all people have unconscious racial biases. Law enforcement officers, he said, need \”to design systems and processes to overcome that very human part of us all.\”</p><p class=\”story-body-text story-content\” data-para-count=\”100\” data-total-count=\”2355\” itemprop=\”articleBody\”>\”Although the research may be unsettling, what we do next is what matters most,\” Mr. Comey said.</p><aside class=\”marginalia comments-marginalia featured-comment-marginalia\” data-marginalia-type=\”sprinkled\” data-skip-to-para-id=\”story-continues-3\”></aside><p class=\”story-body-text story-content\” data-para-count=\”256\” data-total-count=\”2611\” itemprop=\”articleBody\” id=\”story-continues-3\”>He said nearly all police officers had joined the force because they wanted to help others. Speaking in personal terms, Mr. Comey described how most Americans had initially viewed Irish immigrants like his ancestors \”as drunks, ruffians and criminals.\”</p><p class=\”story-body-text story-content\” data-para-count=\”192\” data-total-count=\”2803\” itemprop=\”articleBody\”>\”Law enforcement\’s biased view of the Irish lives on in the nickname we still use for the vehicle that transports groups of prisoners; it is, after all, the \’Paddy wagon,\’ \” he said.</p><p class=\”story-body-text story-content\” data-para-count=\”97\” data-total-count=\”2900\” itemprop=\”articleBody\”>But he said that what the Irish had gone through was nothing compared with what blacks had faced.</p><p class=\”story-body-text story-content\” data-para-count=\”216\” data-total-count=\”3116\” itemprop=\”articleBody\”>\”That experience should be part of every American\’s consciousness, and law enforcement\’s role in that experience, including in recent times, must be remembered,\” he said. \”It is our cultural inheritance.\”</p><p class=\”story-body-text story-content\” data-para-count=\”256\” data-total-count=\”3372\” itemprop=\”articleBody\” id=\”story-continues-4\”>Unlike Mayor Bill de Blasio of New York and Mr. Holder, who were roundly faulted by police groups for their critical remarks about law enforcement, Mr. Comey, a former prosecutor whose grandfather was a police chief in Yonkers, was praised for his remarks.</p><p class=\”story-body-text story-content\” data-para-count=\”302\” data-total-count=\”3674\” itemprop=\”articleBody\”>Ron Hosko, the president of the Law Enforcement Legal Defense Fund and a former senior F.B.I. official, said that while Mr. Holder\’s statements about policing and race after the Ferguson shooting had placed the blame directly on the police, Mr. Comey\’s remarks were far more nuanced and thoughtful.</p><p class=\”story-body-text story-content\” data-para-count=\”170\” data-total-count=\”3844\” itemprop=\”articleBody\”>\”He looked at all the sociological pieces,\” Mr. Hosko said. \”The director\’s comments were far more balanced, because it wasn\’t just heavy-handed on the cops.\”</p><aside class=\”marginalia comments-marginalia comment-prompt-marginalia\” data-marginalia-type=\”sprinkled\” data-skip-to-para-id=\”story-continues-5\”></aside><p class=\”story-body-text story-content\” data-para-count=\”290\” data-total-count=\”4134\” itemprop=\”articleBody\” id=\”story-continues-5\”>Mr. Comey said the police had received most of the blame in episodes like the Ferguson shooting and the death of an unarmed black man in Staten Island who was placed in a chokehold by an officer, but law enforcement was \”not the root cause of problems in our hardest-hit neighborhoods.\”</p><p class=\”story-body-text story-content\” data-para-count=\”132\” data-total-count=\”4266\” itemprop=\”articleBody\”>In many of those areas, blacks grow up \”in environments lacking role models, adequate education and decent employment,\” he said.</p><aside class=\”marginalia comments-marginalia selected-comment-marginalia\” data-marginalia-type=\”sprinkled\” data-skip-to-para-id=\”story-continues-6\”></aside><p class=\”story-body-text story-content\” data-para-count=\”100\” data-total-count=\”4366\” itemprop=\”articleBody\” id=\”story-continues-6\”>Mr. Comey said tensions could be eased if the police got to know those they were charged to protect.</p><p class=\”story-body-text story-content\” data-para-count=\”44\” data-total-count=\”4410\” itemprop=\”articleBody\”>\”It\’s hard to hate up close,\” he said.</p><p class=\”story-body-text story-content\” data-para-count=\”369\” data-total-count=\”4779\” itemprop=\”articleBody\”>He also recommended that law enforcement agencies be compelled, by legislation if necessary, to report shootings that involve police officers, and that those reports be recorded in an accessible database. When Mr. Brown was shot in Ferguson, Mr. Comey said, F.B.I. officials could not say whether such shootings were common or rare because no statistics were available.</p><p class=\”story-body-text story-content\” data-para-count=\”137\” data-total-count=\”4916\” itemprop=\”articleBody\”>\”It\’s ridiculous that I can\’t tell you how many people were shot by the police last week, last month, last year,\” Mr. Comey said.</p><p class=\”story-body-text story-content\” data-para-count=\”94\” data-total-count=\”5010\” itemprop=\”articleBody\”>He added, \”Without complete and accurate data, we are left with ideological thunderbolts.\”</p><p class=\”story-body-text story-content\” data-para-count=\”256\” data-total-count=\”5266\” itemprop=\”articleBody\”>Ronald E. Teachman, the police chief in South Bend, Ind., said Mr. Comey did not need to take on the issue. But Chief Teachman said it would be far easier for him to continue the discussion in Indiana now that Mr. Comey had done so in such a public manner.</p><button class=\”button comments-button theme-speech-bubble\” data-skip-to-para-id=\”story-continues-7\”></button><p class=\”story-body-text story-content\” data-para-count=\”99\” data-total-count=\”5365\” itemprop=\”articleBody\” id=\”story-continues-7\”>\”It helps me move the conversation forward when the F.B.I. director speaks so boldly,\” he said.</p><p class=\”story-body-text story-content\” data-para-count=\”145\” data-total-count=\”5510\” itemprop=\”articleBody\”>Mr. Comey concluded by quoting Dr. King, who said, \”We must all learn to live together as brothers, or we will all perish together as fools.\”</p><p class=\”story-body-text story-content\” data-para-count=\”360\” data-total-count=\”5870\” itemprop=\”articleBody\”>\”We all have work to do — hard work to do, challenging work — and it will take time,\” Mr. Comey said. \”We all need to talk, and we all need to listen, not just about easy things, but about hard things, too. Relationships are hard. Relationships require work. So let\’s begin. It is time to start seeing one another for who and what we really are.\”</p>';

        $scope.article.replace(/\\/g, "");

        $scope.articleTitleData = ['F.B.I. Director Speaks About Race', "What Is the Next ‘Next Silicon Valley’?", "Who Spewed That Abuse? Anonymous Yik Yak App Isn’t Telling"]
            // $scope.article.replace(/\\/g, "");
        $scope.articleTitle = $scope.articleTitleData[0];



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
