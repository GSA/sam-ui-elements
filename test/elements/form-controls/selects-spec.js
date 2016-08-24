'use strict';
var expect = require('chai').expect;
var Selects = require('../../../src/js/elements/form-controls/selects.js');

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

var radioMain = 
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


var radioMainShort = 
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

var radioMainConfig = {
  type: 'radio',
  label: 'Historical figures 2',
  name: 'historical-figures-2',
  options: {
    'stanton': 'Elizabeth Cady Stanton',
    'anthony': 'Susan B. Anthony',
    'tubman': 'Harriet Tubman'
  }
};

var radioShortConfig = {
  type: 'radio',
  label: 'Custom label',
  name: 'historical-figures-2',
  options: {
    'stanton': 'Elizabeth Cady Stanton'
  }
};

var checkboxMain = 
  '<div>'+
    '<fieldset class="usa-fieldset-inputs">'+
      '<legend>Historical figures 2</legend>'+
      '<ul class="usa-unstyled-list">'+
        '<li>'+
          '<input id="stanton" type="checkbox" name="historical-figures-2" value="stanton">'+
          '<label for="stanton">Elizabeth Cady Stanton</label>'+
        '</li>'+
        '<li>'+
          '<input id="anthony" type="checkbox" name="historical-figures-2" value="anthony">'+
          '<label for="anthony">Susan B. Anthony</label>'+
        '</li>'+
        '<li>'+
          '<input id="tubman" type="checkbox" name="historical-figures-2" value="tubman">'+
          '<label for="tubman">Harriet Tubman</label>'+
        '</li>'+
      '</ul>'+
    '</fieldset>'+
  '</div>';

var checkboxMainShort = 
    '<div>'+
      '<fieldset class="usa-fieldset-inputs">'+
        '<legend>Custom label</legend>'+
        '<ul class="usa-unstyled-list">'+
          '<li>'+
            '<input id="stanton" type="checkbox" name="historical-figures-2" value="stanton">'+
            '<label for="stanton">Elizabeth Cady Stanton</label>'+
          '</li>'+
        '</ul>'+
      '</fieldset>'+
    '</div>'; 

var checkboxMainConfig = {
  type: 'checkbox',
  label: 'Historical figures 2',
  name: 'historical-figures-2',
  options: {
    'stanton': 'Elizabeth Cady Stanton',
    'anthony': 'Susan B. Anthony',
    'tubman': 'Harriet Tubman'
  }
};

var checkboxShortConfig = {
  type: 'checkbox',
  label: 'Custom label',
  name: 'historical-figures-2',
  options: {
    'stanton': 'Elizabeth Cady Stanton'
  }
};

/**
 * 
 * Begin <select>
 * 
 */
describe('#SelectInitial', function() {
  it('should return dropdown', function() {

    var expected = dropdownMain;
    var config = Object.create(dropdownMainConfig);
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#SelectCanHavehint', function() {
  it('should return dropdown with hint message', function() {

    var expected = 
      '<div>'+
        '<label for="options">Dropdown label</label>'+
        '<span class="usa-form-hint">Instructional text.</span>'+
        '<select id="options" name="options">'+
          '<option value="value1">Option A</option>'+
          '<option value="value2">Option B</option>'+
          '<option value="value3">Option C</option>'+
        '</select>'+
      '</div>';
    // TODO: var s = {} - is equivalent to creating an instance. Therefore,
    //       var config = s - is equivalent to reference, not copy or clone.
    //       Update tests to use the following: Object.create(s);
    var config = Object.create(dropdownMainConfig);
    config.hint = 'Instructional text.';
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#SelectLabelCanBeScreenReaderOnly', function() {
  it('should return dropdown with label for screen reader only', function() {

    var expected = 
      '<div>'+
        '<label for="options" class="usa-sr-only">Dropdown label</label>'+
        '<select id="options" name="options">'+
          '<option value="value1">Option A</option>'+
          '<option value="value2">Option B</option>'+
          '<option value="value3">Option C</option>'+
        '</select>'+
      '</div>';
    // TODO: var s = {} - is equivalent to creating an instance. Therefore,
    //       var config = s - is equivalent to reference, not copy or clone.
    //       Update tests to use the following: Object.create(s);
    var config = Object.create(dropdownMainConfig);
    config.srOnly = true;
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#SelectCanHaveError', function() {
  it('should return dropdown with error message', function() {

    var expected = 
      '<div class="usa-input-error">'+
        '<label for="options" class="usa-input-error-label">Dropdown label</label>'+
        '<span id="options-input-error" class="usa-input-error-message" role="alert">Helpful error message</span>'+
        '<select id="options" name="options" aria-describedby="options-input-error">'+
          '<option value="value1">Option A</option>'+
          '<option value="value2">Option B</option>'+
          '<option value="value3">Option C</option>'+
        '</select>'+
      '</div>';
    // TODO: var s = {} - is equivalent to creating an instance. Therefore,
    //       var config = s - is equivalent to reference, not copy or clone.
    //       Update tests to use the following: Object.create(s);
    var config = Object.create(dropdownMainConfig);
    config.error = 'Helpful error message';
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#SelectCanHaveErrorExpectsCorrectIdAndAria', function() {
  it('should return dropdown with error message, with the correct values for id and aria', function() {

    var expected = 
      '<div class="usa-input-error">'+
        '<label for="devious" class="usa-input-error-label">Dropdown label</label>'+
        '<span id="devious-input-error" class="usa-input-error-message" role="alert">Helpful message</span>'+
        '<select id="devious" name="devious" aria-describedby="devious-input-error">'+
          '<option value="value1">Option A</option>'+
          '<option value="value2">Option B</option>'+
          '<option value="value3">Option C</option>'+
        '</select>'+
      '</div>';
    // TODO: var s = {} - is equivalent to creating an instance. Therefore,
    //       var config = s - is equivalent to reference, not copy or clone.
    //       Update tests to use the following: Object.create(s);
    var config = Object.create(dropdownMainConfig);
    config.name = 'devious';
    config.error = 'Helpful message';
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#SelectLabelIsCorrect', function() {
  it('should return correct label', function() {

    var expected = dropdownMain;
    var config = Object.create(dropdownMainConfig);
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
    var config = Object.create(dropdownMainConfig);
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#SelectOptionsAreTheExpectedValues', function() {
  it('should return correct dropdowns', function() {

    var expected = dropdownShort;
    var config = Object.create(dropdownShortConfig);
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
    // TODO: var s = {} - is equivalent to creating an instance. Therefore,
    //       var config = s - is equivalent to reference, not copy or clone.
    //       Update tests to us the following.
    var config = Object.create(dropdownShortConfig);
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
    var config = Object.create(dropdownShortConfig);
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
    var config = Object.create(dropdownMainConfig);
    config.disabled = ['value1'];

    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

/**
 * 
 * Begin <radio>
 * 
 */
describe('#RadioInitial)', function() {
  it('should return radio select', function() {

    var expected = radioMain;
    var config = Object.create(radioMainConfig);
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#RadioLegendIsCorrect', function() {
  it('should return correct label', function() {

    var expected = radioMainShort;
    var config = Object.create(radioShortConfig);

    var actual = Selects.select(config);
    expect(actual).to.equal(expected);
  });
});

describe('#RadioOptionsCanPreselect', function() {
  it('should return correct dropdowns, preselected option', function() {


    var expected =
      '<div>'+
        '<fieldset class="usa-fieldset-inputs">'+
          '<legend>Custom label</legend>'+
          '<ul class="usa-unstyled-list">'+
            '<li>'+
              '<input id="stanton" type="radio" name="historical-figures-2" value="stanton" checked>'+
              '<label for="stanton">Elizabeth Cady Stanton</label>'+
            '</li>'+
          '</ul>'+
        '</fieldset>'+
      '</div>';
    var config = Object.create(radioShortConfig);
    config.label = 'Custom label'
    config.type = 'radio';
    config.selected = ['stanton'];

    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#RadioOptionCanBeDisabled', function() {
  it('should be able to disable a single radio button', function() {

    var expected = 
      '<div>'+
        '<fieldset class="usa-fieldset-inputs">'+
          '<legend>Custom label</legend>'+
          '<ul class="usa-unstyled-list">'+
            '<li>'+
              '<input id="stanton" type="radio" name="historical-figures-2" value="stanton" disabled>'+
              '<label for="stanton">Elizabeth Cady Stanton</label>'+
            '</li>'+
          '</ul>'+
        '</fieldset>'+
      '</div>'; 
    var config = Object.create(radioShortConfig);
    config.type = 'radio';
    config.disabled = ['stanton'];

    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

/**
 * 
 * Begin <checkbox>
 * 
 */
describe('#CheckboxInitial)', function() {
  it('should return checkbox select', function() {

    var expected = checkboxMain;
    var config = Object.create(checkboxMainConfig);
    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#CheckboxLegendIsCorrect', function() {
  it('should return correct label', function() {

    var expected = checkboxMainShort;
    var config = Object.create(checkboxShortConfig);

    var actual = Selects.select(config);
    expect(actual).to.equal(expected);
  });
});

describe('#CheckboxOptionCanBeDisabled', function() {
  it('should be able to disable a single checkbox', function() {

    var expected = 
      '<div>'+
        '<fieldset class="usa-fieldset-inputs">'+
          '<legend>Custom label</legend>'+
          '<ul class="usa-unstyled-list">'+
            '<li>'+
              '<input id="stanton" type="checkbox" name="historical-figures-2" value="stanton" disabled>'+
              '<label for="stanton">Elizabeth Cady Stanton</label>'+
            '</li>'+
          '</ul>'+
        '</fieldset>'+
      '</div>'; 
    var config = Object.create(checkboxShortConfig);
    config.type = 'checkbox';
    config.disabled = ['stanton'];

    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});


describe('#CheckboxOptionCanBeDisableMultiple', function() {
  it('should be able to disable a single checkbox', function() {

    var expected = 
      '<div>'+
        '<fieldset class="usa-fieldset-inputs">'+
          '<legend>Historical figures 2</legend>'+
          '<ul class="usa-unstyled-list">'+
            '<li>'+
              '<input id="stanton" type="checkbox" name="historical-figures-2" value="stanton" disabled>'+
              '<label for="stanton">Elizabeth Cady Stanton</label>'+
            '</li>'+
            '<li>'+
              '<input id="anthony" type="checkbox" name="historical-figures-2" value="anthony">'+
              '<label for="anthony">Susan B. Anthony</label>'+
            '</li>'+
            '<li>'+
              '<input id="tubman" type="checkbox" name="historical-figures-2" value="tubman" disabled>'+
              '<label for="tubman">Harriet Tubman</label>'+
            '</li>'+
          '</ul>'+
        '</fieldset>'+
      '</div>';    
    var config = Object.create(checkboxMainConfig);
    config.disabled = ['stanton', 'tubman'];

    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#CheckboxOptionCanSelectMultiple', function() {
  it('should be able to select multiple checkboxes', function() {

    var expected = 
      '<div>'+
        '<fieldset class="usa-fieldset-inputs">'+
          '<legend>Historical figures 2</legend>'+
          '<ul class="usa-unstyled-list">'+
            '<li>'+
              '<input id="stanton" type="checkbox" name="historical-figures-2" value="stanton" checked>'+
              '<label for="stanton">Elizabeth Cady Stanton</label>'+
            '</li>'+
            '<li>'+
              '<input id="anthony" type="checkbox" name="historical-figures-2" value="anthony">'+
              '<label for="anthony">Susan B. Anthony</label>'+
            '</li>'+
            '<li>'+
              '<input id="tubman" type="checkbox" name="historical-figures-2" value="tubman" checked>'+
              '<label for="tubman">Harriet Tubman</label>'+
            '</li>'+
          '</ul>'+
        '</fieldset>'+
      '</div>';    
    var config = Object.create(checkboxMainConfig);
    config.selected = ['stanton', 'tubman'];

    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#CheckboxOptionCanHaveHint', function() {
  it('should be able to add hint to a checkbox fieldset', function() {

    var expected = 
      '<div>'+
        '<fieldset class="usa-fieldset-inputs">'+
          '<legend>Custom label</legend>'+
          '<span class="usa-form-hint">Instructional text.</span>'+
          '<ul class="usa-unstyled-list">'+
            '<li>'+
              '<input id="stanton" type="checkbox" name="historical-figures-2" value="stanton">'+
              '<label for="stanton">Elizabeth Cady Stanton</label>'+
            '</li>'+
          '</ul>'+
        '</fieldset>'+
      '</div>'; 
    var config = Object.create(checkboxShortConfig);
    config.type = 'checkbox';
    config.hint = 'Instructional text.';

    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#CheckboxOptionCanHaveError', function() {
  it('should be able to add an error message to a checkbox fieldset', function() {

    var expected = 
      '<div class="usa-input-error">'+
        '<fieldset class="usa-fieldset-inputs">'+
          '<legend class="usa-input-error-label">Custom label</legend>'+
          '<span id="historical-figures-2-input-error" class="usa-input-error-message" role="alert">Helpful error message</span>'+
          '<ul class="usa-unstyled-list">'+
            '<li>'+
              '<input id="stanton" type="checkbox" name="historical-figures-2" value="stanton">'+
              '<label for="stanton">Elizabeth Cady Stanton</label>'+
            '</li>'+
          '</ul>'+
        '</fieldset>'+
      '</div>'; 
    var config = Object.create(checkboxShortConfig);
    config.error = 'Helpful error message';

    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#CheckboxOptionCanHaveScreenReaderOnly', function() {
  it('should be able to add screen read only property to legend', function() {

    var expected = 
      '<div>'+
        '<fieldset class="usa-fieldset-inputs">'+
          '<legend class="usa-sr-only">Custom label</legend>'+
          '<ul class="usa-unstyled-list">'+
            '<li>'+
              '<input id="stanton" type="checkbox" name="historical-figures-2" value="stanton">'+
              '<label for="stanton">Elizabeth Cady Stanton</label>'+
            '</li>'+
          '</ul>'+
        '</fieldset>'+
      '</div>'; 
    var config = Object.create(checkboxShortConfig);
    config.srOnly = true;

    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#CheckboxOptionCanBeMarkedRequired', function() {
  it('should be able to add required', function() {

    var expected = 
      '<div>'+
        '<fieldset class="usa-fieldset-inputs">'+
          '<legend>Custom label <span class="usa-additional_text">Required</span></legend>'+
          '<ul class="usa-unstyled-list">'+
            '<li>'+
              '<input id="stanton" type="checkbox" name="historical-figures-2" value="stanton">'+
              '<label for="stanton">Elizabeth Cady Stanton</label>'+
            '</li>'+
          '</ul>'+
        '</fieldset>'+
      '</div>'; 
    var config = Object.create(checkboxShortConfig);
    config.markAs = 'required';

    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});

describe('#CheckboxOptionCanBeMarkedOptional', function() {
  it('should be able to add required', function() {

    var expected = 
      '<div>'+
        '<fieldset class="usa-fieldset-inputs">'+
          '<legend>Custom label <span class="usa-additional_text">Optional</span></legend>'+
          '<ul class="usa-unstyled-list">'+
            '<li>'+
              '<input id="stanton" type="checkbox" name="historical-figures-2" value="stanton">'+
              '<label for="stanton">Elizabeth Cady Stanton</label>'+
            '</li>'+
          '</ul>'+
        '</fieldset>'+
      '</div>'; 
    var config = Object.create(checkboxShortConfig);
    config.markAs = 'optional';

    var actual = Selects.select(config);

    expect(actual).to.eql(expected);
  });
});
