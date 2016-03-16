'use strict';

describe('Controller: ConceptlistCtrl', function () {

  // load the controller's module
  beforeEach(module('conceptvectorApp'));

  var ConceptlistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConceptlistCtrl = $controller('ConceptlistCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConceptlistCtrl.awesomeThings.length).toBe(3);
  });
});
