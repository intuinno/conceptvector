'use strict';

describe('Controller: ArticlesCtrl', function () {

  // load the controller's module
  beforeEach(module('conceptvectorApp'));

  var ArticlesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ArticlesCtrl = $controller('ArticlesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ArticlesCtrl.awesomeThings.length).toBe(3);
  });
});
