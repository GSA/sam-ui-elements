'use strict';
var expect = require('chai').expect;
var Selects = require('../../src/js/formcontrols/selects.js');

describe('#SelectExists', function() {
  it('should exist', function() {        
    expect(Selects).to.not.be.undefined;
  });
});



describe('#Select)', function() {
  it('should return dropdown', function() {
    console.log('test found');
    var config = {

    }

    var expected = 
      '<div>'+
        '<label for="options">Dropdown label</label>'+
        '<select name="options" id="options">'+
          '<option value="value1">Option A</option>'+
          '<option value="value2">Option B</option>'+
          '<option value="value3">Option C</option>'+
        '</select>'+
      '</div>';

    var config = {};
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});
