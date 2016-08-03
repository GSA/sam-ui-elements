'use strict';
var expect = require('chai').expect;
var Accordions = require('../../src/js/formcontrols/accordions.js');

describe('Accordions', function() {
    it('should exist', function() {        
        expect(Accordions).to.not.be.undefined;
    });
});



describe('#Accordions)', function() {
    it('it should return a string', function() {
        
        var dataItem = {type:"Success", title:"Test", description:"This is Test"};
        var expected = '<div class="usa-alert usa-alert-success">'+
                            '<div class="usa-alert-body">'+
                              '<h3 class="usa-alert-heading">'+dataItem.title+'</h3>'+
                              '<p class="usa-alert-text">'+dataItem.description+'</p>'+
                            '</div>'+
                          '</div>';
        var actual = Accordions.Accordion(dataItem);
        expect(actual).to.eql(expected);
    });
});