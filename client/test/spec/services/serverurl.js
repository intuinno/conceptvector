'use strict';

describe('Service: serverURL', function () {

  // load the service's module
  beforeEach(module('conceptvectorApp'));

  // instantiate service
  var serverURL;
  beforeEach(inject(function (_serverURL_) {
    serverURL = _serverURL_;
  }));

  it('should do something', function () {
    expect(!!serverURL).toBe(true);
  });

});
