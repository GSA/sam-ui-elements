'use strict';
var expect = require('chai').expect;
var Accordions = require('../../src/js/misc/accordions.js');

describe('Accordions', function() {
    it('should exist', function() {        
        expect(Accordions).to.not.be.undefined;
    });
});

describe('#Accordions', function() {
    it('it should return a string', function() {
        
        var dataItem = 
        {
            accordions: [
                    {title:"Test1", content:"This is Test1"},
                    {title:"Test2", content:"This is Test2", expanded:true},
                    {title:"Test3", content:"This is Test3"}
                  ],
            bordered:false
            
        };
        var expected = '<div class="usa-accordion">'+
                          '<ul class="usa-unstyled-list">'+
                            '<li>'+
                              '<button class="usa-button-unstyled" aria-controls="accordions-1">'+
                                dataItem.accordions[0].title+
                              '</button>'+
                              '<div id="accordions-1" class="usa-accordion-content">'+
                                dataItem.accordions[0].content+
                              '</div>'+
                            '</li>'+
                            '<li>'+
                              '<button class="usa-button-unstyled" aria-expanded="true" aria-controls="accordions-2">'+
                                dataItem.accordions[1].title+
                              '</button>'+
                              '<div id="accordions-2" aria-hidden="false" class="usa-accordion-content">'+
                                dataItem.accordions[1].content+
                              '</div>'+
                            '</li>'+
                            '<li>'+
                              '<button class="usa-button-unstyled" aria-controls="accordions-3">'+
                                dataItem.accordions[2].title+
                              '</button>'+
                              '<div id="accordions-3" class="usa-accordion-content">'+
                                dataItem.accordions[2].content+
                              '</div>'+
                            '</li>'+
                          '</ul>'+
                        '</div>';
                        console.log(expected);
                      
        
        var actual = Accordions.accordions(dataItem);
        
        expect(actual).to.eql(expected);
    });
});
