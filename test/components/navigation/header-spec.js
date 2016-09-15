'use strict';
var expect = require('chai').expect;
var navigation = require('../../../src/js/components/navigation/header.js');

describe('#headerDefined', function() {
  it('should exist', function() {
    expect(navigation.header).to.not.be.undefined;
  });
});

describe('#headerReturnsExpectedString', function() {
  it('returns a string', function() {

    var expected = '<header class="sam-header"><nav aria-label="Main navigation"><ul class="usa-grid usa-unstyled-list"><li><a class="sam-home" href="/"><span>The future SAM.gov</span></a></li><li><a class="sam-search" href="/search/"><span>Search</span></a></li></ul></nav></header>';

    var actual = navigation.header.render({});

    expect(actual).to.eql(expected);
  });
});
