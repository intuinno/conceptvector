'use strict';

/**
 * @ngdoc function
 * @name conceptvectorApp.controller:ConceptlistCtrl
 * @description
 * # ConceptlistCtrl
 * Controller of the conceptvectorApp
 */
angular.module('conceptvectorApp')
    .controller('ConceptlistCtrl', ['$scope', '$http', 'serverURL', function($scope, $http, serverURL) {

        $scope.concepts = ['hello'];
        $scope.currentPage = 1;
        $scope.pageSize = 10;

        $scope.concepts = [];

        // var drinks = [
        //     'coke',
        //     'melange',
        //     'chai latte',
        //     'almdudler',
        //     'beer',
        //     'vodka',
        //     'coconut milk',
        //     'orange juice',
        //     'wine',
        //     'whisky',
        //     'sex on the beach'
        // ];
        // for (var i = 1; i <= 20; i++) {
        //     var drink = drinks[Math.floor(Math.random() * drinks.length)];
        //     $scope.concepts.push('drink ' + i + ': ' + drink);
        // }


        $http.get(serverURL + '/concepts')
            // handle success
            .success(function(data) {
                console.log(data);

                $scope.concepts = data.data;
                // $scope.$apply();
            })
            // handle error
            .error(function(data) {
                console.log(data);
            });


    }]);
