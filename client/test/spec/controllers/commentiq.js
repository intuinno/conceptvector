'use strict';

describe('Controller: CommentiqCtrl', function () {

  // load the controller's module
  beforeEach(module('conceptvectorApp'));

  var CommentiqCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CommentiqCtrl = $controller('CommentiqCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CommentiqCtrl.awesomeThings.length).toBe(3);
  });
});
