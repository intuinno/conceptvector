'use strict';

/**
 * @ngdoc function
 * @name conceptvectorApp.controller:ConceptlistCtrl
 * @description
 * # ConceptlistCtrl
 * Controller of the conceptvectorApp
 */
angular.module('conceptvectorApp')
  .controller('ConceptdetailCtrl', ['$scope', '$http', 'serverURL', '$routeParams', 'AutoComplete', 'recommend', 'AuthService', function($scope, $http, serverURL, $routeParams, AutoComplete, recommend, AuthService) {

    $scope.conceptId = $routeParams.conceptId;
    $scope.download_url = "/#/download_concepts/" + $routeParams.conceptId;

    $scope.positive_scatter_data = [];
    $scope.positive_layout = {};
    $scope.positiveHover = '';

    $(window).resize(function() {
      $scope.positive_layout.width = d3.select("#positive-table").style('width');
      $scope.positive_layout.height = d3.select("#positive-table").style('height');
      $scope.$apply();
    });

    $scope.positive_word_click =  function(e) {
      console.log('click', e);
      var label = e.points[0].data.text[e.points[0].pointNumber];

      if (e.points[0].data.name === "input group") {

        var index = $scope.positiveTags.map(function(d) {
          return d.text;
        }).indexOf(label);

        if (index > -1) {
          $scope.positiveTags.splice(index, 1);
        }

        $scope.tagChanged();


      } else {
        $scope.addPositive(label);
      }

    };

    var newPositiveWords = [];
    var newNegativeWords = [];

    if ($scope.conceptId === 'new') {

      $scope.positiveTags = [];
      $scope.negativeTags = [];
      $scope.irrelevantTags = [];
      $scope.concept_help = '';

    } else {

      $http.get(serverURL + '/concepts/' + $routeParams.conceptId).success(function(data) {
        console.log(data);
        $scope.concept = data;
        $scope.concept_name = $scope.concept.name;
        $scope.concept_type = $scope.concept.concept_type;
        $scope.positiveTags = $scope.concept.input_terms.positive;
        $scope.negativeTags = $scope.concept.input_terms.negative;

        if ($scope.concept.input_terms.irrelevant === undefined) {
          $scope.irrelevantTags = [];
        } else {
          $scope.irrelevantTags = $scope.concept.input_terms.irrelevant;
        }
        $scope.tagChanged();

      });

    }

    $scope.isSettingCollapsed = true;

    $scope.positiveRecommendation = [];
    $scope.negativeRecommendation = [];
    $scope.concept_help = '';

    $scope.isOwner = function() {

      if (AuthService.isLoggedIn()) {

        if ("concept" in $scope && AuthService.getUserId() === $scope.concept.creator_id) {
          return true;
        }

        if ($scope.conceptId === 'new') {

          return true;
        }

      }

      return false;

    };

    $scope.saveConcept = function() {

      var newConcept = {
        "name": $scope.concept_name,
        "help_text": $scope.concept_help,
        "concept_type": $scope.concept_type,
        "input_terms": {
          "positive": $scope.positiveTags,
          "negative": $scope.negativeTags,
          "irrelevant": $scope.irrelevantTags

        }

      };

      if ($scope.conceptId === 'new') {

        $http.post(serverURL + '/concepts', newConcept)
          // handle success
          .success(function(data) {
            $scope.concept = data;

            $scope.fileSuccess = true;
            $scope.fileError = false;
            $scope.conceptId = data.id;
            // $scope.$apply();
          })
          // handle error
          .error(function(data) {
            console.log(data);
            $scope.fileError = true;
            $scope.fileSuccess = false;
          });

      } else {

        $http.patch(serverURL + '/concepts/' + $scope.conceptId, newConcept)
          // handle success
          .success(function(data) {

            $scope.fileSuccess = true;
            $scope.fileError = false;
            // $scope.$apply();
          })
          // handle error
          .error(function(data) {
            console.log(data);
            $scope.fileError = true;
            $scope.fileSuccess = false;
          });

      }



    };

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
      });

      var irrelevantTags = $scope.irrelevantTags.map(function(d) {
        return d['text'];
      });

      $scope.loadingPromise = recommend.save({
        'positiveWords': positiveTags,
        'negativeWords': negativeTags,
        'irrelevantWords': irrelevantTags,
        'positiveCluster': $scope.positiveRecommendation,
        'negativeCluster': $scope.negativeRecommendation
      }, function(entry) {
        // console.log(entry);

        var positiveClusterWords = [];

        $scope.positiveRecommendation.forEach(function(d) {
          positiveClusterWords = positiveClusterWords.concat(d);
        });

        newPositiveWords = entry.positiveRecommend.filter(function(d) {
          return positiveClusterWords.indexOf(d) === -1;
        });

        var positiveTemp = entry.positiveRecommend.map(function(d, i) {
          return {
            word: d,
            cluster: entry.positiveCluster[i]
          }
        });

        var positiveCluster = new Array(5);
        for (var i = 0; i < 5; i++) {
          positiveCluster[i] = positiveTemp.filter(function(d) {
            return d.cluster === i;
          }).map(function(d) {
            return d.word;
          }).sort();
        }

        $scope.positiveRecommendation = positiveCluster;

        var negativeClusterWords = [];

        $scope.negativeRecommendation.forEach(function(d) {
          negativeClusterWords = negativeClusterWords.concat(d);
        });

        newNegativeWords = entry.negativeRecommend.filter(function(d) {
          return negativeClusterWords.indexOf(d) === -1;
        });

        var negativeTemp = entry.negativeRecommend.map(function(d, i) {
          return {
            word: d,
            cluster: entry.negativeCluster[i]
          }
        });

        var negativeCluster = new Array(5);
        for (var i = 0; i < 5; i++) {
          negativeCluster[i] = negativeTemp.filter(function(d) {
            return d.cluster === i;
          }).map(function(d) {
            return d.word
          }).sort();
        }

        $scope.negativeRecommendation = negativeCluster;

        var positiveTSNE = entry.positiveRecoTSNE.concat(entry.positiveTermTSNE);

        function generateData(searchTerms, recommendTerms, tsne) {
          var data = [],
            shapes = ['circle', 'circle', 'circle', 'circle', 'circle', 'square'];

          recommendTerms.forEach(function(d) {
            d.size = 1;
          });

          var allTerms = recommendTerms.concat(searchTerms.map(function(d) {
            return {
              word: d,
              cluster: 'input',
              size: 2
            }
          }));

          var vocab = allTerms.map(function(d, i) {
            return {
              label: d.word,
              cluster: '' + d.cluster,
              x: tsne[i][0],
              y: tsne[i][1],
              size: d.size,
              // size: 1,
              shape: shapes[d.cluster % 6],
            }
          });

          var nest = d3.nest()
            .key(function(d) {
              return d.cluster;
            })
            .entries(vocab);

          nest.forEach(function(d) {
            d.values.forEach(function(d2, i) {
              d2.clusterIndex = i;
              positiveChartWordIndex.push(d2);

            });
          });

          positiveChartWordIndex.forEach(function(d, i) {
            d.index = i;
          });



          // highlightInputWords();
          return nest;
        }

        $scope.data = generateData(positiveTags, positiveTemp, positiveTSNE);

        var colorScale = d3.scale.category10();

        $scope.positive_scatter_data = $scope.data.map(function(d,i) {
          return {
            x: d.values.map(function(d) {
              return d.x;
            }),
            y: d.values.map(function(d) {
              return d.y;
            }),
            mode: 'markers+text',
            name: d.key + ' group',
            hoverinfo: 'text+name',
            text: d.values.map(function(d) {
              return d.label
            }),
            textposition: 'top center',
            textfont: {
              size: 9,
              color: colorScale(i),
              opacity: 0.3
            },
            type: 'scatter',
            marker: {
              opacity: 0.4,
              size: 15
            }
          };
        })

        var negativeTSNE = entry.negativeRecoTSNE.concat(entry.negativeTermTSNE);


        $scope.negative_data = generateData(negativeTags, negativeTemp, negativeTSNE);
        // $scope.negative_apiObj.api.refresh();

      });

    };

    var positiveChartWordIndex = [];

    $scope.isNewPositive = function(word) {
      return newPositiveWords.indexOf(word) !== -1;
    };

    $scope.isNewNegative = function(word) {
      return newNegativeWords.indexOf(word) !== -1;
    };


    $scope.addPositiveCluster = function(cluster) {

      cluster.forEach(function(d) {

        $scope.positiveTags.push({
          'text': d
        });

      });

      $scope.tagChanged();
    };

    $scope.addNegativeCluster = function(cluster) {
      cluster.forEach(function(d) {

        $scope.negativeTags.push({
          'text': d
        });

      });

      $scope.tagChanged();
    };

    $scope.addIrrelevantCluster = function(cluster) {
      cluster.forEach(function(d) {

        $scope.irrelevantTags.push({
          'text': d
        });

      });

      $scope.tagChanged();

    };

    $scope.addIrrelevant = function(word) {
      $scope.irrelevantTags.push({
        'text': word
      });
      $scope.tagChanged();
    }

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


    $scope.buttonHoverWordNegative = function(word) {
      $scope.$broadcast('wordHoverNegative', word);
    };

    $scope.buttonMoveoutWordNegative = function(word) {
      $scope.$broadcast('wordMoveoutNegative', word);
    };

    $scope.buttonHoverClusterNegative = function(cluster) {

      cluster.forEach(function(word) {
        $scope.$broadcast('wordHoverNegative', word);
      });
    };

    $scope.buttonMoveoutClusterNegative = function(cluster) {
      cluster.forEach(function(word) {
        $scope.$broadcast('wordMoveoutNegative', word);
      });
    };

    $scope.negativeChartEvents = {
      "wordHoverNegative": function(e, scope, args) {
        var evt = buildHoverEvt(args, scope);
        scope.chart.scatter._calls.highlightPoint(evt.seriesIndex, evt.pointIndex, true);

      },
      "wordMoveoutNegative": function(e, scope, args) {
        var evt = buildHoverEvt(args, scope);
        scope.chart.scatter._calls.highlightPoint(evt.seriesIndex, evt.pointIndex, false);
      }
    };


    $scope.buttonHoverWord = function(word) {
      // $scope.$broadcast('wordHover', word);
      $scope.positiveHover = [word];
    };

    $scope.buttonMoveoutWord = function(word) {
      $scope.positiveHover = [];
    };

    $scope.highlightInputWords = function() {
      // console.log(inputTags);
      var positiveWords = $scope.positiveTags.map(function(d) {
        return d['text'];
      });

      $scope.buttonHoverCluster(positiveWords);
      var negativeWords = $scope.negativeTags.map(function(d) {
        return d['text'];
      });

      $scope.buttonHoverClusterNegative(negativeWords);
    };

    $scope.removehighlightInputWords = function() {
      // console.log(inputTags);
      var positiveWords = $scope.positiveTags.map(function(d) {
        return d['text'];
      });
      $scope.buttonMoveoutCluster(positiveWords);

      var negativeWords = $scope.negativeTags.map(function(d) {
        return d['text'];
      });
      $scope.buttonMoveoutClusterNegative(negativeWords);
    };

    $scope.positiveChartCallback = function(scope, element) {
      $scope.highlightInputWords();
    };
    $scope.buttonHoverCluster = function(cluster) {

      console.log(cluster);
      $scope.positiveHover = cluster;
    };

    $scope.buttonMoveoutCluster = function(cluster) {
      $scope.positiveHover = [];
    };

    $scope.data = [];
    $scope.negative_data = [];
    $scope.all_data = [];

    $scope.apiObj = {};
    $scope.negative_apiObj = {};
    $scope.all_apiObj = {};



  }]);
