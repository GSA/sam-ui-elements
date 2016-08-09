'use strict';
var expect = require('chai').expect;
var Selects = require('../../src/js/formcontrols/selects.js');

describe('#SelectExists', function() {
  it('should exist', function() {        
    expect(Selects).to.not.be.undefined;
  });
});

var dropdownMain = 
  '<div>'+
    '<label for="options">Dropdown label</label>'+
    '<select id="options" name="options">'+
      '<option value="value1">Option A</option>'+
      '<option value="value2">Option B</option>'+
      '<option value="value3">Option C</option>'+
    '</select>'+
  '</div>';

var dropdownMainConfig = {
  type: 'dropdown',
  label: 'Dropdown label',
  name: 'options',
  options: {
    'value1': 'Option A',
    'value2': 'Option B',
    'value3': 'Option C'
  }
};

var dropdownShort =
  '<div>'+
    '<label for="options">Dropdown label</label>'+
    '<select id="options" name="options">'+
      '<option value="value1">Option A</option>'+
    '</select>'+
  '</div>';

var dropdownShortConfig = {
  type: 'dropdown',
  label: 'Dropdown label',
  name: 'options',
  options: {
    'value1': 'Option A'
  }
};
describe('#SelectInitial)', function() {
  it('should return dropdown', function() {

    var expected = dropdownMain;
    var config = dropdownMainConfig;
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#SelectLabelIsCorrect', function() {
  it('should return correct label', function() {

    var expected = dropdownMain;
    var config = dropdownMainConfig;
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

    var expected = dropdownMain;
    var config = dropdownMainConfig;
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#SelectOptionsAreTheExpectedValues', function() {
  it('should return correct dropdowns', function() {

    var expected = dropdownShort;
    var config = dropdownShortConfig;
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#SelectOptionsCanPreselect', function() {
  it('should return correct dropdowns, preselected option', function() {

    var expected = 
      '<div>'+
        '<label for="options">Dropdown label</label>'+
        '<select id="options" name="options">'+
          '<option value="value1" selected>Option A</option>'+
        '</select>'+
      '</div>';
    var config = dropdownShortConfig;
    config.selected = ['value1'];

    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

// TODO: Test is annoying - because it logs - maybe we should just take the first? 
// Do we really want to make developers change the pre-selected options every time they
// change the type?
describe('#SelectOptionsCanOnlyHaveOneSelection', function() {
  it('should return empty string, too many preselected option', function() {

    var expected = '';
    var config = dropdownShortConfig;
    config.selected = ['value1', 'value2'];

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
    var config = dropdownMainConfig;
    config.disabled = ['value1'];

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

describe.only('#RadioLegendIsCorrect', function() {
  it('should return correct label', function() {

    var expected =
      '<div>'+
        '<fieldset class="usa-fieldset-inputs">'+
          '<legend>Custom label</legend>'+
          '<ul class="usa-unstyled-list">'+
            '<li>'+
              '<input id="stanton" type="radio" name="historical-figures-2" value="stanton">'+
              '<label for="stanton">Elizabeth Cady Stanton</label>'+
            '</li>'+
          '</ul>'+
        '</fieldset>'+
      '</div>';  

    var config = {
      type: 'radio',
      label: 'Custom label',
      name: 'historical-figures-2',
      options: {
        'stanton': 'Elizabeth Cady Stanton'
      }
    };
    var actual = Selects.select(config);
    expect(actual).to.equal(expected);
  });
});
