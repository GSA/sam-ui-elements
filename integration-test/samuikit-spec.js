'use strict';
var expect = require('chai').expect;
var Samuikit = require('../dist/samuikit.js');

describe('Samuikit', function() {
    it('should exist', function() {        
        expect(Samuikit).to.not.be.undefined;
    });
});



describe('#Accordions)', function() {
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
                        
                      
        
        var actual = Samuikit.accordions.render(dataItem);
        
        expect(actual).to.eql(expected);
    });
});

describe('#Label)', function() {
    it('it should return a string', function() {
        
        var dataItem = {type:"small", data:"Test"};
        var expected = '<span class="usa-label">Test</span>'; 
        var actual = Samuikit.label.render(dataItem);
        // console.log(actual);
        expect(actual).to.eql(expected);
    });

});

describe('#Header', function() {
    it('returns a string', function() {       
      var expected = '<section id="iae-header"><header><div class="iae-header"><div class="usa-grid">' +
             '<div class="iae-header-menu"><div class="iae-header-nav"><i class="fa fa-bars"></i>' + 
           '<div class="m_T-1x">MENU</div></div><div class="iae-header-logo"><a class="image-wrap" href="#">' +
           '<img alt="Transtion SAM.gov Logo" src="assets/img/transition-sam-logo.png"></a></div></div>' +
             '<div class="iae-sign-in"><i class="fa fa-search"></i><i class="fa fa-bell"></i>' +
           '<div class="pull-right m_L-3x">Create Account</div><div class="pull-right">|</div>' +
           '<div class="pull-right m_R-3x">Sign in</div></div></div></div></header></section>';

        var actual = Samuikit.header.render({});
        expect(actual).to.eql(expected);
    });
});
