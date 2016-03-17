'use strict';

describe('Controller: ConceptdetailCtrl', function () {

  // load the controller's module
  beforeEach(module('conceptvectorApp'));

  var ConceptdetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConceptdetailCtrl = $controller('ConceptdetailCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConceptdetailCtrl.awesomeThings.length).toBe(3);
  });
});
