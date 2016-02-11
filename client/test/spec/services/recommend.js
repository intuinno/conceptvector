'use strict';

describe('Service: recommend', function () {

  // load the service's module
  beforeEach(module('conceptvectorApp'));

  // instantiate service
  var recommend;
  beforeEach(inject(function (_recommend_) {
    recommend = _recommend_;
  }));

  it('should do something', function () {
    expect(!!recommend).toBe(true);
  });

});
