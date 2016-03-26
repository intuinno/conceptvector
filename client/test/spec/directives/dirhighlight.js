'use strict';

describe('Directive: dirhighlight', function () {

  // load the directive's module
  beforeEach(module('conceptvectorApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<dirhighlight></dirhighlight>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dirhighlight directive');
  }));
});
