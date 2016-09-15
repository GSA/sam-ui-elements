'use strict';
var expect = require('chai').expect;
var navigation = require('../../../src/js/components/navigation/footer.js');

describe('footer', function() {
  it('should exist', function() {
    expect(navigation.footer).to.not.be.undefined;
  });
});

describe('footer', function() {
  it('returns a string', function() {

    var expected = '<footer id="sam-footer" aria-label="footer-navigation"><div class="usa-grid usa-footer-return-to-top"><a href="#">Return to top</a></div><div class="sam-footer-wrapper"><nav class="usa-grid sam-footer-body"><div class="sam-footer-logo usa-width-one-sixth"><a href="http://www.gsa.gov"><span>General Services Administration Website</span></a></div></nav></div></footer>';

    var actual = navigation.footer.render({});

    expect(actual).to.eql(expected);
  });
});
