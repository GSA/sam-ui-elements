'use strict';
var expect = require('chai').expect;
var Buttons = require('../../src/js/formcontrols/buttons.js');

describe('Buttons', function() {
    it('should exist', function() {        
        expect(Buttons).to.not.be.undefined;
    });
});



describe('#Button)', function() {
    it('it should return a string', function() {
        
        var dataItem = {type:"default", data:"Primary"};
        var expected = '<button>Primary</button>';
        var actual = Buttons.button(dataItem);
        expect(actual).to.eql(expected);
    });
});