'use strict';
var expect = require('chai').expect;
var Footer = require('../../../src/common/navigation/footer.js');

describe('Footer', function() {
    it('should exist', function() {
        expect(Footer).to.not.be.undefined;
    });
});

describe('Footer', function() {
    it('returns a string', function() {
      var expected = 	'<section id="iae-footer"><footer><div class="usa-grid-full usa-footer-return-to-top"><a href="#">Return to top</a>' +
						'</div><div class="iae-footer"><div class="iae-footer-body usa-grid-full">' +
				         '<div class="iae-footer-logo usa-width-one-sixth">' +
			             '<a class="image-wrap" href="http://www.gsa.gov" target="_blank"><img alt="GSA logo" src="assets/img/logo-gsa.png"></a></div>' +
				        '<ul class="iae-footer-links usa-unstyled-list usa-width-five-sixths">' +
					    '<li class=" usa-width-one-fourth">' +
						'<h4 class="m_T-0 iae-footer-head">About</h4><ul class="iae-footer-links usa-unstyled-list">' +
						'<li class="m_B"><a href="/about/" title="What Is This Site?">What Is This Site?</a></li>' +
						'<li class="m_B"><a href="/transition-roadmap/" title="Transition Timeline">Transition Timeline</a></li>' +
						'<li class="m_B"><a href="https://interact.gsa.gov/group/integrated-award-environment-iae-industry-community" target="_blank" title="Join our Interact Community">Join our Interact Community</a></li>' +
						'<li class="m_B"><a href="/for-developers/" title="For Developers">For Developers</a></li></ul></li></ul></div></div></footer></section>';

        var actual = Footer.Footer({});
        expect(actual).to.eql(expected);
    });
});
