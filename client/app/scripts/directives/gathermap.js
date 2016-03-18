'use strict';

/**
 * @ngdoc directive
 * @name commentiqApp.directive:gathermap
 * @description
 * # gathermap
 */
angular.module('conceptvectorApp')
    .directive('gathermap', function() {
        return {
            restrict: 'EAC',
            scope: {
                data: "=",
                config: "=",
                context: "="
            },

            link: function postLink(scope, element, attrs) {

                var internalData;

                scope.$watch('data', function(newVals, oldVals) {

                    if (newVals.length === 0) {
                        return;
                    }

                    if (newVals.length === oldVals.length) {
                        return scope.renderColorChange();
                    }

                    internalData = newVals;

                    mapCrossfilter.remove();

                    mapCrossfilter.add(internalData);

                    return scope.renderDataChange();

                }, true);

                scope.$watch(function() {
                    return angular.element(window)[0].innerWidth;
                }, function() {
                    return resize();
                });


                scope.renderDataChange = function() {

                    chart.drawComments(internalData);

                }


                scope.renderColorChange = function() {

                    chart.drawClass(internalData);

                }

                var width = d3.select(element[0]).node().offsetWidth,
                    height = width * 0.7;

                var mapData;

                var chart = d3.intuinno.gathermap()
                    .scale(width)
                    .size([width, height]);

                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .call(chart);

                d3.json('data/us.json', function(error, us) {

                    chart.drawStates(us);
                    mapData = us;

                });

                chart.addBrush();

                var filteredLocations;


                chart.on('brushing', function(brush) {
                    // console.log(JSON.stringify(d3.event.target.extent()));
                    filteredLocations = filterLocation(brush);
                    // // console.log(filteredLocations);
                    // console.log(JSON.stringify(d3.event.target.extent()));
                    // console.log(JSON.stringify(brush));
                    scope.data.forEach(function(d) {
                        d.selected = false;
                    });
                    filteredLocations.forEach(function(d) {
                        d.selected = true;
                    });
                });

                chart.on('brushended', function(brush) {

                    if (filteredLocations.length === 0) {
                        internalData.forEach(function(d) {
                            d.selected = true;
                        });
                        // d3.select(".brush").call(brush.clear());
                    }

                    scope.data = internalData;

                    scope.$apply();
                });

                var mapCrossfilter = crossfilter();

                // mapCrossfilter.add(internalData);

                var location = mapCrossfilter.dimension(function(d) {
                    return [d.Longitude, d.Latitude];
                });

                var filterLocation = function(area) {

                    var longitudes = [area[0][0], area[1][0]];
                    var latitudes = [area[0][1], area[1][1]];

                    location.filterFunction(function(d) {
                        // return d[0] >= longitudes[0] && d[0] <= longitudes[1] && d[1] >= latitudes[0] && d[1] <= latitudes[1];

                        if (d[0] >= longitudes[0] && d[0] <= longitudes[1] && d[1] >= latitudes[1] && d[1] <= latitudes[0]) {

                            // console.log(d);
                            return true;
                        } else {
                            return false;
                        }
                    });

                    return location.top(Infinity);

                };

                function resize() {

                    if (!mapData || internalData.length === 0) {
                        return;
                    }

                    width = d3.select(element[0]).node().parentNode.parentNode.offsetWidth;
                    height = width * 0.7;

                    chart.scale(width)
                        .size([width, height]);

                    svg.attr('width', width)
                        .attr('height', height)
                        .call(chart);




                    chart.drawStates(mapData);

                    chart.drawComments(internalData);

                    chart.updateBrush();
                }

            }
        };
    });


d3.intuinno = d3.intuinno || {};

d3.intuinno.gathermap = function module() {

    var dispatch = d3.dispatch('hover', 'drawEnd', 'brushing', 'brushended'),
        projection,
        path,
        t,
        s,
        svg,
        center,
        scale,
        size,
        brush,
        force,
        legend,
        stateGroup,
        nodeGroup,
        legendGroup,
        x1, x2, y1, y2, brushX, brushY,
        container;

    var legendRectSize = 18; // NEW
    var legendSpacing = 4;

    function exports(_selection) {

        svg = _selection;



        if (!container) {

            container = svg.append("g").classed("container-group", true);
            container.append("g").classed("map-group", true);
            container.append("g").classed("comment-group", true);
            container.append("g").classed("legend-group", true);


        }

        svg.datum([]);

        projection = d3.geo.albers()
            .scale(scale)
            .translate([size[0] / 2, size[1] / 2])
            .precision(.1);


        // projection = d3.geo.equirectangular()
        //     .scale(scale*0.8)
        //     .translate([300,200])
        //     .rotate([96,0])
        //     .center([-0.6,38.7])
        //     // .parallels([29.5,45.5]);
        //     .precision(.1);

        path = d3.geo.path()
            .projection(projection);

        exports.drawLegends();


    }

    exports.drawLegends = function() {



        var statusArray = ['New', 'Accepted', 'Rejected', 'Picked'];

        svg.select('.legend-group')
            .selectAll('*').remove();


        legend = svg.select('.legend-group')
            .selectAll('.legend') // NEW
            .data(statusArray) // NEW
            .enter() // NEW
            .append('g') // NEW
            .attr('class', 'legend') // NEW
            .attr('transform', function(d, i) { // NEW
                var height = legendRectSize + legendSpacing; // NEW
                var offset = size[0] / statusArray.length;
                var vert = 0; // NEW
                var horz = i * offset; // NEW
                return 'translate(' + horz + ',' + vert + ')'; // NEW
            }); // NEW

        legend.append('rect') // NEW
            .attr('width', legendRectSize) // NEW
            .attr('height', legendRectSize) // NEW
            .attr('class', function(d) {

                return "commentMapMark " + d;
            })

        legend.append('text') // NEW
            .attr('x', legendRectSize + legendSpacing) // NEW
            .attr('y', legendRectSize - legendSpacing) // NEW
            .text(function(d) {
                return d;
            }); // NEW

    }

    exports.drawStates = function(_data) {
        svg.select('.map-group')
            .selectAll('*').remove();

        svg.select('.map-group')
            .append('path')
            .attr('class', 'state')
            .datum(topojson.mesh(_data, _data.objects.states))
            .attr("d", path);
    }

    exports.drawComments = function(_data) {

        var dataOnScreen = _data.filter(function(d) {

            var a = projection([+d.Longitude, +d.Latitude]);

            if (isNaN(a[0])) {
                return false;
            }
            return a;
        });


        force = d3.layout.force()
            .nodes(dataOnScreen)
            .links([])
            .gravity(0)
            .charge(-3)
            .on('tick', tick)
            .theta(0.8)
            .chargeDistance(30)
            .start();



        var node = svg.select('.comment-group')
            .selectAll('.commentMapMark')
            .data(dataOnScreen, function(d) {
                return d.CommentSequence;
            });


        node.exit().remove();

        node.enter()
            .append('circle');

        node.attr('cx', function(d) {
                return 0;
            })
            .attr('cy', function(d) {
                return 0;
            })
            .attr('r', 1)
            .attr('class', function(d) {

                var selectionStatus;

                if (d.selected) {
                    selectionStatus = 'selected';
                } else {
                    selectionStatus = 'notSelected';
                }

                return "commentMapMark " + d.status + " " + selectionStatus;
            })
            .on('mouseover', dispatch.hover);
            // .call(force.drag);

        // var n = node.length;
        // for (var i = 3; i > 0; --i)
        // force.start();
        //     force.tick({alpha:1});

        // force.stop();

        function tick(e) {
            var k = .9 * e.alpha;
            // console.log(e.alpha);

            node
                .attr("cx", function(o) {

                    var temp = (projection([o.Longitude, o.Latitude])[0] - o.x) * k
                    if (isNaN(temp)) {
                        console.log(o);
                    }

                    return o.x += (projection([o.Longitude, o.Latitude])[0] - o.x) * k;
                })
                .attr("cy", function(o) {
                    return o.y += (projection([o.Longitude, o.Latitude])[1] - o.y) * k;
                });
        }



    };


    exports.drawClass = function(_data) {

        var node;

        var dataOnScreen = _data.filter(function(d) {

            var a = projection([+d.Longitude, +d.Latitude]);

            if (isNaN(a[0])) {
                return false;
            }
            return a;
        });

        node = svg.select('.comment-group')
            .selectAll('.commentMapMark')
            .data(dataOnScreen, function(d) {
                return d.CommentSequence;
            });



        node.attr('class', function(d) {

            var selectionStatus;

            if (d.selected) {
                selectionStatus = 'selected';
            } else {
                selectionStatus = 'notSelected';
            }

            return "commentMapMark " + d.status + " " + selectionStatus;
        });


    };

    exports.addBrush = function() {


        //Get the longitude of the top left corner of our map area.
        var long1 = projection.invert([0, 0])[0];
        //Get the longitude of the top right corner of our map area.
        var long2 = projection.invert([size[0], 0])[0];

        //Get the latitude of the top left corner of our map area.
        var lat1 = projection.invert([0, 0])[1];
        //Get the latitude of the bottom left corner of our map area.
        var lat2 = projection.invert(size)[1];

        //Create a linear scale generator for the x of our brush.
        brushX = d3.scale.linear()
            .range([0, size[0]])
            .domain([long1, long2]);

        //Create a linear scale generator for the y of our brush.
        brushY = d3.scale.linear()
            .range([0, size[1]])
            .domain([lat1, lat2]);

        //Create our brush using our brushX and brushY scales.
        brush = d3.svg.brush()
            .x(brushX)
            .y(brushY)
            .on('brush', brushing)
            .extent([
                [100, 100],
                [200, 200]
            ]);

        // console.log(brushX.invert(d3.mouse(this)[0]));
        // console.log(d3.event.target.extent()[0]);
        // });

        brush.on('brushend', function(brush) {

            dispatch.brushended(brush);
            console.log(d3.mouse(this));

        });

        brush.on('brushstart', function(brush) {
            console.log(d3.mouse(this));
        })

        function brushing() {

            var extent = d3.event.target.extent();
            console.log(JSON.stringify(extent));
            console.log("top left: " + projection.invert([brushX(extent[0][0]), brushY(extent[1][1])]));
            console.log("bottom right: " + projection.invert([brushX(extent[1][0]), brushY(extent[0][1])]));
            dispatch.brushing([projection.invert([brushX(extent[0][0]), brushY(extent[1][1])]), projection.invert([brushX(extent[1][0]), brushY(extent[0][1])])]);
        };

        svg.append('g')
            .attr('class', 'brushMap')
            .call(brush)
            .selectAll('rect')
            .attr('width', size[0]);

        return this;
    };



    exports.updateBrush = function() {

        //Get the longitude of the top left corner of our map area.
        var long1 = projection.invert([0, 0])[0];
        //Get the longitude of the top right corner of our map area.
        var long2 = projection.invert([size[0], 0])[0];

        //Get the latitude of the top left corner of our map area.
        var lat1 = projection.invert([0, 0])[1];
        //Get the latitude of the bottom left corner of our map area.
        var lat2 = projection.invert(size)[1];

        //Create a linear scale generator for the x of our brush.
        brushX = d3.scale.linear()
            .range([0, size[0]])
            .domain([long1, long2]);

        //Create a linear scale generator for the y of our brush.
        brushY = d3.scale.linear()
            .range([0, size[1]])
            .domain([lat1, lat2]);

        //Create our brush using our brushX and brushY scales.
        brush = d3.svg.brush()
            .x(brushX)
            .y(brushY)
            .on('brush', brushing)
            .on('brushend', dispatch.brushended);

        function brushing() {

            var extent = d3.event.target.extent();
            // console.log(JSON.stringify(extent));
            // console.log("top left: " + projection.invert([brushX(extent[0][0]), brushY(extent[1][1])]));
            // console.log("bottom right: " + projection.invert([brushX(extent[1][0]), brushY(extent[0][1])]));
            dispatch.brushing([projection.invert([brushX(extent[0][0]), brushY(extent[1][1])]), projection.invert([brushX(extent[1][0]), brushY(extent[0][1])])]);
        };

        svg.select('.brushMap')
            .call(brush)
            .selectAll('rect')
            .attr('width', size[0]);

    };



    exports.center = function(_x) {

        if (!arguments.length) return center;

        center = _x;
        return this;
    };

    exports.scale = function(_x) {

        if (!arguments.length) return scale;

        scale = _x;
        return this;
    };

    exports.size = function(_x) {

        if (!arguments.length) return size;

        size = _x;
        return this;
    };

    exports.reset = function(_x) {

        svg.selectAll('*').remove();
    };

    d3.rebind(exports, dispatch, 'on');
    return exports;

};
