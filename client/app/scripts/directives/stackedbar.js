'use strict';

/**
 * @ngdoc directive
 * @name commentiqApp.directive:stackedBar
 * @description
 * # stackedBar
 */
angular.module('conceptvectorApp')
    .directive('stackedBar', function() {
        return {
            restrict: 'EAC',
            scope: {
                data: "=",
                config: "=",
                context: "=",
                help: "="
            },

            link: function postLink(scope, element, attrs) {

                var criteriaData = mixDataForChart(scope.data, scope.help);

                scope.$watch('data', function(newVals, oldVals) {

                    return scope.renderDataChange();

                }, true);

                scope.$watch(function() {
                    return angular.element(window)[0].innerWidth;
                }, function() {
                    return resize();
                });

                scope.renderDataChange = function() {

                    criteriaData = mixDataForChart(scope.data, scope.help);

                    domParent.datum(criteriaData)
                        .call(chart);

                }

                var width = d3.select(element[0]).node().offsetWidth ,
                    height = 50;

                var chart = d3.intuinno.stackedBar()
                    .size([width, height]);

                var domParent = d3.select(element[0])
                    .datum(criteriaData)
                    .call(chart);

                function resize() {

                    width = d3.select(element[0]).node().offsetWidth;
                    height = 50;

                    chart.size([width, height]);

                    domParent.call(chart);

                }

                function mixDataForChart(data, help) {

                    var mixedData = angular.copy(help);

                    var mixedData = mixedData.map(function(d) {
                        d.value = data.weights[d.name];
                        return d;
                    })

                    return mixedData;
                }

            }
        };
    });

d3.intuinno = d3.intuinno || {};

d3.intuinno.stackedBar = function module() {

    var margin = {
            top: 10,
            right: 0,
            bottom: 10,
            left: 0
        },
        width = 500,
        height = 80,
        gap = 0,
        ease = 'bounce';

    var svg;

    var data;

    var dispatch = d3.dispatch('customHover');

    function exports(_selection) {

        _selection.each(function(_data) {

            var chartW = width - margin.left - margin.right,
                chartH = height - margin.top - margin.bottom;

            var nonZeroData = _data.filter(function(d) {
                return d.value > 0;
            });

            var x0 = 0

            nonZeroData.forEach(function(d) {
                d.x1 = x0;
                x0 = d.x1 + Number(d.value);
            })

            var xScale = d3.scale.linear()
                .domain([0, d3.sum(nonZeroData, function(d) {
                    return d.value;
                })])
                .range([0, chartW]);

            var color = d3.scale.category20()
            				.domain(_data.map(function(d){return d.name;}));

            var tip = d3.tip().attr('class','d3-tip')
            				.offset([-10, 0]).html(function(d) { return d.display_text;});

            if (!svg) {
                svg = d3.select(this)
                    .append("svg")
                    .classed("chart", true);
                var container = svg.append("g").classed("container-group", true);
                container.append("g").classed("chart-group", true);
            }

            svg.transition().attr({
                width: width,
                height: height
            });
            svg.select(".container-group")
                .attr({
                    transform: "translate(" + margin.left + "," + margin.top + ")"
                });

            svg.call(tip);


            var bars = svg.select(".chart-group")
                .selectAll(".bar")
                .data(nonZeroData, function(d) {
                    return d.name;
                });

            bars.enter().append("rect")
                .classed("bar", true)
                .on("mouseover", function(d) {



                    dispatch.customHover(d);
                    tip.show(d);
                })
                .on("mouseout",tip.hide)
                .style("fill", function(d) {
                    return color(d.name);
                });

            bars.attr({
                x: function(d) {
                    return xScale(d.x1);
                },
                height: chartH,
                y: 0,
                width: function(d) {
                    return xScale(d.value);
                }
            });


            bars.exit().transition().style({
                opacity: 0
            }).remove();

        })


    }

    exports.size = function(_x) {

        if (!arguments.length) return size;

        width = _x[0];
        height = _x[1];
        return this;
    };

    d3.rebind(exports, dispatch, 'on');
    return exports;

};
