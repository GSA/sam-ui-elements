'use strict';
var expect = require('chai').expect;
var Labels = require('../../src/js/elements/labels.js');

describe('Labels', function() {
    it('should exist', function() {        
        expect(Labels).to.not.be.undefined;
    });
});



describe('#Label)', function() {
    it('it should return a string', function() {
        
        var dataItem = {type:"small", data:"Test"};
        var expected = '<span class="usa-label">Test</span>'; 
        var actual = Labels.label.render(dataItem);
        console.log(actual);
        expect(actual).to.eql(expected);
    });

});
