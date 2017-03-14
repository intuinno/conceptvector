(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name conceptvectorApp.directive:scatter
   * @description
   * # scatter
   */
  angular.module('conceptvectorApp')
    .directive('scatter',
      function() {

        return {
          restrict: 'EA',
          scope: {
            data: "=",
            layout: "=",
            onclick: '&',
            hover: "="
          },
          link: function(scope, iElement, iAttrs) {

            scope.$watch('hover', function(newVal) {
              console.log(newVal);

              console.log(scope.plot_data);
              var points = [];
              scope.plot_data.forEach(function(d, i) {
                d.text.forEach(function(c,j) {
                  if (newVal.indexOf(c) !== -1) {
                    points.push({curveNumber:i, pointNumber:j});
                  }
                });
              });
              Plotly.Fx.hover(iElement[0], points);
            }, true);
            scope.$watch('data', function(plots) {
              var layout = {
                'width': 400,
                'height': 400,
                'pad': '0',
                'margin': {
                  't': 40,
                  'b': 20,
                  'l': 20,
                  'r': 0
                },
                showlegend: true,
                legend: {
                  x: 1,
                  y: 1
                },
                legend: {
                  "orientation": "h"
                },
                'hovermode': 'closest'
              };

              scope.plot_data = plots;

              Plotly.newPlot(iElement[0], plots, layout, {
                scrollZoom: true,
                displaylogo: false
              });

              iElement[0].on('plotly_click', function(data) {
                scope.onclick({e:data})
              });

            }, true);



            scope.$watch('layout', function(l) {
              var layout = {
                'width': parseInt(l.width) - 30,
                'height': parseInt(l.height) - 30,
                'pad': '0',
                'margin': {
                  't': 0,
                  'b': 20,
                  'l': 40,
                  'r': 0
                },
                showlegend: true,
                legend: {
                  x: 1,
                  y: 1
                },
                legend: {
                  "orientation": "h"
                },
                'hovermode': 'closest'
              };
              Plotly.newPlot(iElement[0], scope.plot_data, layout, {
                scrollZoom: true,
                displaylogo: false
              });
            }, true);


          }
        };

      });

}());
