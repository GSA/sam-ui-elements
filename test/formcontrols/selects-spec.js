'use strict';
var expect = require('chai').expect;
var Selects = require('../../src/js/formcontrols/selects.js');

describe('#SelectExists', function() {
  it('should exist', function() {        
    expect(Selects).to.not.be.undefined;
  });
});

describe('#SelectInitial)', function() {
  it('should return dropdown', function() {

    var expected = 
      '<div>'+
        '<label for="options">Dropdown label</label>'+
        '<select id="options" name="options">'+
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

describe('#SelectLabelIsCorrect', function() {
  it('should return correct label', function() {

    var expected =
      '<div>'+
        '<label for="options">Hello</label>'+
        '<select id="options" name="options">'+
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
        '<select id="something" name="something">'+
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
        '<select id="options" name="options">'+
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

describe.only('#SelectOptionsCanPreselect', function() {
  it('should return correct dropdowns, preselected option', function() {

    var expected =
      '<div>'+
        '<label for="options">Dropdown label</label>'+
        '<select id="options" name="options">'+
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

describe('#SelectOptionsCanOnlyHaveOneSelection', function() {
  it('should return empty string, too many preselected option', function() {

    var expected = '';

    var config = {
      type: 'dropdown',
      label: 'Dropdown label',
      name: 'options',
      options: {
        'value1': 'Option A',
        'value2': 'Option B'
      },
      selected: ['value1', 'value2']
    };
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#SelectOptionsCanBeDisabled', function() {
  it('should be able to disable select', function() {

    var expected = 
      '<div>'+
        '<label for="options">Dropdown label</label>'+
        '<select id="options" name="options" disabled>'+
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
      },
      disabled: ['value1']
    };
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#RadioInitial)', function() {
  it('should return radio select', function() {

    var expected = 
      '<div>'+
        '<fieldset class="usa-fieldset-inputs">'+
          '<legend>Historical figures 2</legend>'+
          '<ul class="usa-unstyled-list">'+
            '<li>'+
              '<input id="stanton" type="radio" name="historical-figures-2" value="stanton">'+
              '<label for="stanton">Elizabeth Cady Stanton</label>'+
            '</li>'+
            '<li>'+
              '<input id="anthony" type="radio" name="historical-figures-2" value="anthony">'+
              '<label for="anthony">Susan B. Anthony</label>'+
            '</li>'+
            '<li>'+
              '<input id="tubman" type="radio" name="historical-figures-2" value="tubman">'+
              '<label for="tubman">Harriet Tubman</label>'+
            '</li>'+
          '</ul>'+
        '</fieldset>'+
      '</div>';

    var config = {
      type: 'radio',
      label: 'Historical figures 2',
      name: 'options',
      options: {
        'stanton': 'Elizabeth Cady Stanton',
        'anthony': 'Susan B. Anthony',
        'tubman': 'Harriet Tubman'
      }
    };
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});
