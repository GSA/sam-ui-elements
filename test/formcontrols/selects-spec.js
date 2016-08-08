'use strict';
var expect = require('chai').expect;
var Selects = require('../../src/js/formcontrols/selects.js');

describe('#SelectExists', function() {
  it('should exist', function() {        
    expect(Selects).to.not.be.undefined;
  });
});

describe('#SelectLabelIsCorrect', function() {
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
      type: 'dropdown',
      label: 'Hello',
      name: 'options',
      options: {
        'value1': 'Option A',
        'value2': 'Option B',
        'value3': 'Option C'
      }
    };
    var actual = Selects.select(config);
    expect(actual).to.equal(expected);

    config = {
      type: 'dropdown',
      label: 'Devious',
      name: 'options',
      options: {
        'value1': 'Option A',
        'value2': 'Option B',
        'value3': 'Option C'        
      }
    };
    var actual = Selects.select(config);
    expect(actual).to.not.equal(expected);
  });
});

describe('#SelectNameIsCorrect', function() {
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
      type: 'dropdown',
      label: 'Dropdown label',
      name: 'something',
      options: {
        'value1': 'Option A',
        'value2': 'Option B',
        'value3': 'Option C'
      }
    };
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#SelectOptionsAreTheExpectedValues', function() {
  it('should return correct dropdowns', function() {

    var expected =
      '<div>'+
        '<label for="options">Dropdown label</label>'+
        '<select name="options" id="options">'+
          '<option value="value1">Option A</option>'+
        '</select>'+
      '</div>';

    var config = {
      type: 'dropdown',
      label: 'Dropdown label',
      name: 'options',
      options: {
        'value1': 'Option A'
      }
    };
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#SelectOptionsCanPreselect', function() {
  it('should return correct dropdowns, preselected option', function() {

    var expected =
      '<div>'+
        '<label for="options">Dropdown label</label>'+
        '<select name="options" id="options">'+
          '<option value="value1" selected>Option A</option>'+
        '</select>'+
      '</div>';

    var config = {
      type: 'dropdown',
      label: 'Dropdown label',
      name: 'options',
      options: {
        'value1': 'Option A'
      },
      selected: ['value1']
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
      type: 'dropdown',
      label: 'Dropdown label',
      name: 'options',
      options: {
        'value1': 'Option A',
        'value2': 'Option B',
        'value3': 'Option C'
      }
    };
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});
