'use strict';

describe('Directive: scatter', function () {

  // load the directive's module
  beforeEach(module('conceptvectorApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<scatter></scatter>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the scatter directive');
  }));
});
