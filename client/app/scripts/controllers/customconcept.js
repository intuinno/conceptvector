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
            });
            
            recommend.save({
                'positiveWords': positiveTags,
                'negativeWords': negativeTags
            }, function(entry) {
                // console.log(entry);

                var positiveTemp = entry.positiveRecommend.map(function(d, i) {
                    return { word: d, cluster: entry.positiveCluster[i] }
                });

                var positiveCluster = new Array(5);
                for (var i = 0; i < 5; i++) {
                    positiveCluster[i] = positiveTemp.filter(function(d) {
                        return d.cluster === i;
                    }).map(function(d) {
                        return d.word
                    })
                }

                $scope.positiveRecommendation = positiveCluster;

                var negativeTemp = entry.negativeRecommend.map(function(d, i) {
                    return { word: d, cluster: entry.negativeCluster[i] }
                });

                var negativeCluster = new Array(5);
                for (var i = 0; i < 5; i++) {
                    negativeCluster[i] = negativeTemp.filter(function(d) {
                        return d.cluster === i;
                    }).map(function(d) {
                        return d.word
                    })
                }

                $scope.negativeRecommendation = negativeCluster;


                var positiveTermsWithSearchTerms = entry.positiveVectors.concat(entry.positiveSearchTermVectors);
                tsne.initDataRaw(positiveTermsWithSearchTerms);

                var start = new Date().getTime();
                console.log("Starting T-SNE calculation", start);

                for (var k = 0; k < 500; k++) {
                    tsne.step(); // every time you call this, solution gets better
                }
                var end = new Date().getTime();
                console.log("T-SNE calculation ended ", end - start);

                var Y = tsne.getSolution();



                /* Random Data Generator (took from nvd3.org) */
                function generateData(searchTerms, recommendTerms, tsne) {
                    var data = [],
                        shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'];

                    var allTerms = recommendTerms.concat(searchTerms.map(function(d) {
                        return { word: d, cluster: 'input' }
                    }));

                    var vocab = allTerms.map(function(d, i) {
                        return { word: d.word, cluster: '' + d.cluster, x: tsne[i][0], y: tsne[i][1], size: 1, shape: shapes[d.cluster % 6] }
                    });



                    var nest = d3.nest()
                        .key(function(d) {
                            return d.cluster;
                        })
                        .entries(vocab);


                    return nest;
                }

                $scope.data = generateData(positiveTags, positiveTemp, Y);
                $scope.apiObj.api.refresh();


                var negativeTermsWithSearchTerms = entry.negativeVectors.concat(entry.negativeSearchTermVectors);
                tsne.initDataRaw(negativeTermsWithSearchTerms);

                var start = new Date().getTime();
                console.log("Starting T-SNE calculation", start);

                for (var k = 0; k < 500; k++) {
                    tsne.step(); // every time you call this, solution gets better
                }
                var end = new Date().getTime();
                console.log("T-SNE calculation ended ", end - start);

                var Y = tsne.getSolution();


                $scope.negative_data = generateData(negativeTags, negativeTemp, Y);
                // $scope.negative_apiObj.api.refresh();

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

        $scope.options = {
            chart: {
                type: 'scatterChart',
                height: 450,
                color: d3.scale.category10().range(),
                scatter: {
                    onlyCircles: false,
                    dispatch: {
                        elementClick: function(e) {
                            console.log('click', e);
                            if (e.point.cluster === "input") {

                                var index = $scope.positiveTags.map(function(d) {
                                    return d.text;
                                }).indexOf(e.point.word);

                                if (index > -1) {
                                    $scope.positiveTags.splice(index, 1);
                                }

                                $scope.tagChanged();


                            } else {
                                $scope.addPositive(e.point.word);
                            }

                        }
                    }
                },
                showDistX: false,
                showDistY: false,
                pointSize: function(d) {
                    return d.size || 1
                }, //by default
                pointRange: [10, 100],
                pointDomain: [0, 1],
                tooltip: {
                    contentGenerator: function(e) {
                        // console.log(e);
                        var series = e.series[0];
                        if (series.value === null) return;

                        var rows =
                            "<tr>" +
                            "<td class='key'>" + '' + "</td>" +
                            "<td class='x-value'>" + e.point.word + "</td>" +
                            "</tr>";

                        var header =
                            "<thead>" +
                            "<tr>" +
                            "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                            "<td class='key'><strong>" + series.key + "</strong></td>" +
                            "</tr>" +
                            "</thead>";

                        return "<table>" +
                            header +
                            "<tbody>" +
                            rows +
                            "</tbody>" +
                            "</table>";
                    }
                },
                duration: 350,
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        return d3.format('.02f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d) {
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -5
                },
                zoom: {
                    //NOTE: All attributes below are optional
                    enabled: true,
                    scaleExtent: [0.5, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: false,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

        $scope.negative_options = {
            chart: {
                type: 'scatterChart',
                height: 450,
                color: d3.scale.category10().range(),
                scatter: {
                    onlyCircles: false,
                    dispatch: {
                        elementClick: function(e) {
                            console.log('click', e);
                            if (e.point.cluster === "input") {

                                var index = $scope.negativeTags.map(function(d) {
                                    return d.text;
                                }).indexOf(e.point.word);

                                if (index > -1) {
                                    $scope.negativeTags.splice(index, 1);
                                }

                                $scope.tagChanged();


                            } else {
                                $scope.addNegative(e.point.word);
                            }

                        }
                    }
                },
                showDistX: false,
                showDistY: false,
                pointSize: function(d) {
                    return d.size || 1
                }, //by default
                pointRange: [10, 100],
                pointDomain: [0, 1],
                tooltip: {
                    contentGenerator: function(e) {
                        // console.log(e);
                        var series = e.series[0];
                        if (series.value === null) return;

                        var rows =
                            "<tr>" +
                            "<td class='key'>" + '' + "</td>" +
                            "<td class='x-value'>" + e.point.word + "</td>" +
                            "</tr>";

                        var header =
                            "<thead>" +
                            "<tr>" +
                            "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                            "<td class='key'><strong>" + series.key + "</strong></td>" +
                            "</tr>" +
                            "</thead>";

                        return "<table>" +
                            header +
                            "<tbody>" +
                            rows +
                            "</tbody>" +
                            "</table>";
                    }
                },
                duration: 350,
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        return d3.format('.02f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d) {
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -5
                },
                zoom: {
                    //NOTE: All attributes below are optional
                    enabled: true,
                    scaleExtent: [0.5, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: false,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };



        $scope.all_options = {
            chart: {
                type: 'scatterChart',
                height: 450,
                color: d3.scale.category10().range(),
                scatter: {
                    onlyCircles: false,
                    dispatch: {}
                },
                showDistX: false,
                showDistY: false,
                pointSize: function(d) {
                    return d.size || 1
                }, //by default
                pointRange: [10, 100],
                pointDomain: [0, 1],
                tooltip: {
                    contentGenerator: function(e) {
                        // console.log(e);
                        var series = e.series[0];
                        if (series.value === null) return;

                        var rows =
                            "<tr>" +
                            "<td class='key'>" + '' + "</td>" +
                            "<td class='x-value'>" + e.point.word + "</td>" +
                            "</tr>";

                        var header =
                            "<thead>" +
                            "<tr>" +
                            "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                            "<td class='key'><strong>" + series.key + "</strong></td>" +
                            "</tr>" +
                            "</thead>";

                        return "<table>" +
                            header +
                            "<tbody>" +
                            rows +
                            "</tbody>" +
                            "</table>";
                    }
                },
                duration: 50,
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        return d3.format('.02f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d) {
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -5
                },
                zoom: {
                    //NOTE: All attributes below are optional
                    enabled: true,
                    scaleExtent: [0.5, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: false,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };


        /* For TSNE.js */
        var opt = {}
        opt.epsilon = 10;
        opt.perplexity = 30;
        opt.dim = 2;

        var tsne = new tsnejs.tSNE(opt);



        $scope.data = [];
        $scope.negative_data = [];
        $scope.all_data = [];

        d3.text("data/glove.6B.300d.10k.txt", function(d) {

            var coor_data = d3.csv.parseRows(d);

            d3.text("data/glove.6B.300d.voc.txt", function(label) {

                var data = label.trimRight().split('\n').map(function(a, i) {


                    return { word: a, cluster: 'stars', x: +coor_data[i][0], y: +coor_data[i][1], size: 0.1, shape: 'circle' };

                });

                $scope.all_data = d3.nest()
                    .key(function(d) {
                        return d.cluster;
                    })
                    .entries(data);
                // $scope.all_apiObj.api.refresh();

            });
        });

        $scope.apiObj = {};
        $scope.negative_apiObj = {};
        $scope.all_apiObj = {};
        $scope.isSettingCollapsed = true;


    }]);
