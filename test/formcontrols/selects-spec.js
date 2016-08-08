'use strict';
var expect = require('chai').expect;
var Selects = require('../../src/js/formcontrols/selects.js');

describe('#SelectExists', function() {
  it('should exist', function() {        
    expect(Selects).to.not.be.undefined;
  });
});

describe('#SelectLabelRequired)', function() {
  it('should return empty string', function() {

    var expected = '';

    var config = {};
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#SelectLabelIsCorrect)', function() {
  it('should return correct label', function() {

    var expected =
      '<div>'+
        '<label for="options">Hello</label>'+
        '<select name="options" id="options">'+
          '<option value="value1">Option A</option>'+
          '<option value="value2">Option B</option>'+
          '<option value="value3">Option C</option>'+
        '</select>'+
      '</div>';    

    var config = {
      label: 'Hello',
      name: 'options'
    };
    var actual = Selects.select(config);
    expect(actual).to.equal(expected);

    config = {
      label: 'Devious',
      name: 'options'
    };
    var actual = Selects.select(config);
    expect(actual).to.not.equal(expected);
  });
});

describe('#SelectNameRequired)', function() {
  it('should return empty string', function() {

    var expected = '';

    var config = {
      name: 'hello'
    };
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#SelectNameIsCorrect)', function() {
  it('should return correct name', function() {

    var expected = 
      '<div>'+
        '<label for="something">Dropdown label</label>'+
        '<select name="something" id="something">'+
          '<option value="value1">Option A</option>'+
          '<option value="value2">Option B</option>'+
          '<option value="value3">Option C</option>'+
        '</select>'+
      '</div>';    

    var config = {
      label: 'Dropdown label',
      name: 'something'
    };
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#SelectInitial)', function() {
  it('should return dropdown', function() {

    var expected = 
      '<div>'+
        '<label for="options">Dropdown label</label>'+
        '<select name="options" id="options">'+
          '<option value="value1">Option A</option>'+
          '<option value="value2">Option B</option>'+
          '<option value="value3">Option C</option>'+
        '</select>'+
      '</div>';

    var config = {
      label: 'Dropdown label',
      name: 'options'
    };
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});
