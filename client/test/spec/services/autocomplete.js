'use strict';

describe('Service: AutoComplete', function () {

  // load the service's module
  beforeEach(module('conceptvectorApp'));

  // instantiate service
  var AutoComplete;
  beforeEach(inject(function (_AutoComplete_) {
    AutoComplete = _AutoComplete_;
  }));

  it('should do something', function () {
    expect(!!AutoComplete).toBe(true);
  });

});
