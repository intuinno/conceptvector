'use strict';

describe('Filter: highlight', function () {

  // load the filter's module
  beforeEach(module('conceptvectorApp'));

  // initialize a new instance of the filter before each test
  var highlight;
  beforeEach(inject(function ($filter) {
    highlight = $filter('highlight');
  }));

  it('should return the input prefixed with "highlight filter:"', function () {
    var text = 'angularjs';
    expect(highlight(text)).toBe('highlight filter: ' + text);
  });

});
