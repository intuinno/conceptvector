'use strict';

describe('Controller: TwitterCtrl', function () {

  // load the controller's module
  beforeEach(module('conceptvectorApp'));

  var TwitterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TwitterCtrl = $controller('TwitterCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TwitterCtrl.awesomeThings.length).toBe(3);
  });
});
