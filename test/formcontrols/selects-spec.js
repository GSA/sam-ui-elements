'use strict';
var expect = require('chai').expect;
var Selects = require('../../src/js/formcontrols/selects.js');

describe('#SelectExists', function() {
  it('should exist', function() {        
    expect(Selects).to.not.be.undefined;
  });
});

// TODO: Testing required members failing gracefully too fragile this way.
// 
// describe('#SelectLabelRequired)', function() {
//   it('should return empty string', function() {

//     var expected = '';

//     var config = {};
//     var actual = Selects.select(config);

//     expect(actual).to.eql(expected);
//   });
// });

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
      type: 'dropdown',
      label: 'Hello',
      name: 'options',
      options: {}
    };
    var actual = Selects.select(config);
    expect(actual).to.equal(expected);

    config = {
      type: 'dropdown',
      label: 'Devious',
      name: 'options',
      options: {}
    };
    var actual = Selects.select(config);
    expect(actual).to.not.equal(expected);
  });
});

// TODO: Testing required members failing gracefully too fragile this way.
// 
// describe('#SelectNameRequired)', function() {
//   it('should return empty string', function() {

//     var expected = '';

//     var config = {
//       label: 'Dropdown label',
//     };
//     var actual = Selects.select(config);

//     expect(actual).to.eql(expected);
//   });
// });

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
      type: 'dropdown',
      label: 'Dropdown label',
      name: 'something',
      options: {}
    };
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

// TODO: Testing required members failing gracefully too fragile this way.
// 
// describe('#SelectTypeRequired)', function() {
//   it('should return empty string', function() {

//     var expected = '';

//     var config = {
//       label: 'hello',
//       name: 'hello'
//     };
//     var actual = Selects.select(config);

//     expect(actual).to.eql(expected);
//   });
// });

describe('#SelectOptionsAreRequired)', function() {
  it('should return empty string', function() {

    var expected = '';

    var config = {
      type: 'dropdown',
      label: 'Dropdown label',
      name: 'options',
      opttions: {}
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
      options: {}
    };
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});
