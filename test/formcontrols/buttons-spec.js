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
        
        var dataItem = {type:"Primry-Default", data:"Default"};
        var expected = '<button>Default</button>';
        var actual = Buttons.Button(dataItem);
        expect(actual).to.eql(expected);
    });
});