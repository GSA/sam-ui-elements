'use strict';
var expect = require('chai').expect;
var Header = require('../../src/js/common/header.js');

describe('Header', function() {
    it('should exist', function() {        
        expect(Header).to.not.be.undefined;
    });
});

describe('Header', function() {
    it('returns a string', function() {       
      var expected = '<section id="sam-header"><header><div class="sam-header"><div class="usa-grid">' +
				     '<div class="sam-header-menu"><div class="sam-header-nav"><i class="fa fa-bars"></i>' + 
					 '<div class="m_T-1x">MENU</div></div><div class="sam-header-logo"><a class="image-wrap" href="#">' +
					 '<img alt="Transtion SAM.gov Logo" src="assets/img/transition-sam-logo.png"></a></div></div>' +
				     '<div class="sam-sign-in"><i class="fa fa-search"></i><i class="fa fa-bell"></i>' +
					 '<div class="pull-right m_L-3x">Create Account</div><div class="pull-right">|</div>' +
					 '<div class="pull-right m_R-3x">Sign in</div></div></div></div></header></section>';

        var actual = Header.Header({});
        expect(actual).to.eql(expected);
    });
});