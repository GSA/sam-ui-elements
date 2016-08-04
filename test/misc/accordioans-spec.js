'use strict';
var expect = require('chai').expect;
var Accordions = require('../../src/js/misc/accordions.js');

describe('Accordions', function() {
    it('should exist', function() {        
        expect(Accordions).to.not.be.undefined;
    });
});



describe('#Accordions)', function() {
    it('it should return a string', function() {
        
        var dataItem = 
        {
            data: [
                    {title:"Test1", content:"This is Test1"},
                    {title:"Test2", content:"This is Test2", expanded:true},
                    {title:"Test3", content:"This is Test3"}
                  ],
            bordered:false
            
        };
        var expected = '<div class="usa-accordion">'+
                          '<ul class="usa-unstyled-list">'+
                            '<li>'+
                              '<button class="usa-button-unstyled" aria-expanded="false" aria-controls="accordions-1">'+
                                dataItem.data[0].title+
                              '</button>'+
                              '<div id="accordions-1" aria-hidden="true" class="usa-accordion-content">'+
                                dataItem.data[0].content+
                              '</div>'+
                            '</li>'+
                            '<li>'+
                              '<button class="usa-button-unstyled" aria-expanded="true" aria-controls="accordions-2">'+
                                dataItem.data[1].title+
                              '</button>'+
                              '<div id="accordions-2" aria-hidden="false" class="usa-accordion-content">'+
                                dataItem.data[1].content+
                              '</div>'+
                            '</li>'+
                            '<li>'+
                              '<button class="usa-button-unstyled" aria-expanded="false" aria-controls="accordions-3">'+
                                dataItem.data[2].title+
                              '</button>'+
                              '<div id="accordions-3" aria-hidden="true" class="usa-accordion-content">'+
                                dataItem.data[2].content+
                              '</div>'+
                            '</li>'+
                          '</ul>'+
                        '</div>';
        
        var actual = Accordions.Accordion(dataItem);
        
        expect(actual).to.eql(expected);
    });
});