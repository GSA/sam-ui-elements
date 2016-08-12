var Selects;

/**
 * @Class Selects
 *
 * A 'pure' class, for lack of a better term. For generating:
 *   select - with options
 *   checkboxes - with options
 *   radio button - with options
 *
 * The config passed into the main entry method is not modified, and no external
 * methods are called either; this is the complete, encapsulated, definition.
 *   
 * @type {Object}
 * 
 */
Selects = {
    /**
     * Entry point.
     *
     * Note: For error handling, all form controls are wrapped in
     *       a container <div>.
     * 
     * @param  {[type]} config A string using JSON
     * @return {[type]}        HTML string in compliance with US and SAM WDS
     * 
     */
    select: function(config) {

      if (this.isInvalidConfiguration(config)) {
        // configuration is not valid
        // return early without crash
        // errors are logged in console
        return '';
      }

      var error = '';
      if (this.hasError(config)) {
        error = ' class="usa-input-error"'

      }
      html = '<div'+error+'>';
      html += this.getOpening(config);
      html += this.getOptions(config);
      html += this.getClosing(config);
      html += '</div>';
      
      return html;
    },
    /**
     * @private
     *
     * Generates the main wrapper for the specified type.
     * 
     * radio and checkbox types are wrapped in a <fieldset>, with <legend>,
     *   and the opening of a list.
     *   
     * select type uses <label> and <select> opening tag, instead.
     * 
     * @param  {[type]} config A string using JSON
     * @return {[type]}        HTML string in compliance with US and SAM WDS
     * 
     */
    getOpening: function(config) {
      var opening = [];
      if (config.type == 'radio' || config.type == 'checkbox') {
        opening.push('<fieldset class="usa-fieldset-inputs">');
        opening.push('<legend>'+config.label+'</legend>');
        opening.push('<ul class="usa-unstyled-list">');

      } else {
        var disabled = '';
        if (this.hasDisabled(config)) {
          disabled = ' disabled';

        }

        var error = '';
        if (this.hasError(config)) {
          error = ' class="usa-input-error-label"'

        }
        opening.push('<label for="'+config.name+'"'+error+'>'+config.label+'</label>');
        
        if (this.hasError(config)) {
          opening.push('<span id="'+config.name+'-input-error" class="usa-input-error-message" role="alert">'+config.error+'</span>');
        }

        if (this.hasHint(config)) {
          opening.push('<span class="usa-form-hint">'+config.hint+'</span>');

        }
        
        var selectAria = '';
        if (this.hasError(config)) {
          selectAria = ' aria-describedby="'+config.name+'-input-error"';

        }
        opening.push('<select id="'+config.name+'" name="'+config.name+'"'+selectAria+disabled+'>');

      }
      return opening.join('');
    },
    /**
     * @private
     *
     * Generates the closing for the main wrapper (see getOpening) for the type.
     *
     * @param  {[type]} config A string using JSON
     * @return {[type]}        HTML string in compliance with US and SAM WDS
     * 
     */
    getClosing: function(config) {
      var closing = [];
      if (config.type == 'radio' || config.type == 'checkbox') {
        closing.push('</ul>');
        closing.push('</fieldset>');

      } else {
        closing.push('</select>');

      }
      return closing.join('');
    },
    /**
     * @private
     *
     * Prepares and enumerates the individual form options for the user to choose from.
     * 
     * @param  {[type]} config A string using JSON
     * @return {[type]}        HTML string in compliance with US and SAM WDS
     * 
     */
    getOptions: function(config) {
      // make configuration members concrete
      // required members
      var disabled = this.disabled(config);
      var selected = this.selected(config);

      // build options
      var optionHtml = [];
      for (var optionValue in config.options) {
        // TODO: Is there a linter rule (or set of rules) that allows/checks for something like this?        
        var optionConfig = {
          type    : config.type,
          name    : config.name,
          value   : optionValue,
          title   : config.options[optionValue],
          selected: selected,
          disabled: disabled
        }
        var html = this.option(optionConfig);
        optionHtml.push(html);

      }
      return optionHtml.join('');
    },    
    /**
     * @private
     *
     * Process individual form option. Configuration is system generated, not the same
     * as the config passed to the main entry method.
     * 
     * @param  {[type]} config A string using JSON
     * @return {[type]}        HTML string in compliance with US and SAM WDS
     * 
     */
    option: function(optionConfig) {
      // do not need to validate this config, system-generated
      // make configuration members concrete
      selected = '';
      if (this.optionIsSelected(optionConfig) && optionConfig.type == 'checkbox') {
        selected = ' checked';

      } else if (this.optionIsSelected(optionConfig) && (optionConfig.type == 'dropdown' || optionConfig.type == 'radio')) {
        selected = ' selected';

      }

      var html = [];
      if (optionConfig.type == 'radio' || optionConfig.type == 'checkbox') {
        var disabled = '';
        if (this.optionIsDisabled(optionConfig)) {
          disabled = ' disabled';

        }
        
        html.push('<li>');
        html.push('<input id="'+optionConfig.value+'" type="'+optionConfig.type+'" name="'+optionConfig.name+'" value="'+optionConfig.value+'"'+disabled+selected+'>');

        html.push('<label for="'+optionConfig.value+'">'+optionConfig.title+'</label>');
        html.push('</li>');

      } else {
        html.push('<option value="'+optionConfig.value+'"'+selected+'>'+optionConfig.title+'</option>');

      }
      return html.join('');
    },
    /**
     * @private
     * 
     * @param  {[type]}  config A string using JSON
     * @return {Boolean}        Whether there are values marked as disabled.
     * 
     */
    hasDisabled: function(config) {
      return (config.disabled !== undefined && config.disabled.length > 0);      
    },
    /**
     * @private
     * 
     * @param  {[type]} config A string using JSON
     * @return {[type]}        The array of disabled values set in config
     * 
     */
    disabled: function(config) {
      return (this.hasDisabled(config)) 
        ? config.disabled 
        : [];
    },
    /**
     * @private
     * 
     * @param  {[type]}  config A string using JSON
     * @return {Boolean}        Whether there are values marked as selected.
     * 
     */
    hasSelected: function(config) {
      return (config.selected !== undefined && config.selected.length > 0);
    },
    /**
     * @private
     * 
     * @param  {[type]} config A string using JSON
     * @return {[type]}        The array of selected values set in config
     * 
     */
    selected: function(config) {
      return (this.hasSelected(config)) 
        ? config.selected 
        : [];
    },
    /**
     * @private
     * 
     * @param  {[type]} config A string using JSON
     * @return {[type]}        Whether the option is selected.
     * 
     */
    optionIsSelected: function(config) {
      return (this.hasSelected(config) && config.selected.indexOf(config.value) > -1);
    },
    /**
     * @private
     * 
     * @param  {[type]} config A string using JSON
     * @return {Boolean}       Whether the option is disabled.
     * 
     */
    optionIsDisabled: function(config) {
      return (this.hasDisabled(config) && config.disabled.indexOf(config.value) > -1);
    },
    /**
     * @private
     * 
     * @param  {[type]}  config A string using JSON
     * @return {Boolean}        Whether an error message was passed.
     */
    hasError: function(config) {
      return (config.error !== undefined && config.error.length > 0);
    },
    hasHint: function(config) {
      return (config.hint !== undefined && config.hint.length > 0);
    },
    /**
     * @private
     *
     * Validates the config against the specified business (established by SAM WDS)
     * and technical (established by W3C on use of select, radio, and checkbox) rules.
     * 
     * @param  {[type]}  config A string using JSON
     * @return {Boolean}        Whether configuration complies with established rules.
     * 
     */
    isInvalidConfiguration: function(config) {

      if (config.label == undefined || config.label.length < 1) {
        console.log('Selects: "label" is required member. And must have value.');
        console.log(config);
        return true;

      } else if (config.name == undefined || config.name.length < 1) {
        console.log('Selects: "name" is required member. And must have value.');
        console.log(config);
        return true;

      } else if (config.type == undefined || config.type.length < 1) {
        console.log('Selects: "type" is required member. And must have value');
        console.log(config);
        return true;

      } else if (config.options == undefined || Object.keys(config.options).length == 0) {
        console.log('Selects: "options" is required member, and must have at least one.');
        console.log(Object.keys(config.options).length);
        console.log(config);
        return true;

      } else if ((config.type == 'dropdown' || config.type == 'radio') && config.selected !== undefined && config.selected.length > 1) {
        // Note: A select dropdown can only have one pre-selected option.
        //       We could solve this by:
        //       1. Only paying attention to the first one during the build.
        //       2. Removing all but the first one from config.selected.
        //       3. Something else...??
        //       
        //       However, mutating state on the object passed in could make
        //       tracking down defects related to the way developers setup
        //       the configuration in the first place. Therefore, this is an
        //       implementation rule that must be followed. If a bug is
        //       introduced, there are only two places that defect could be:
        //       1. Either the configuration is invalid.
        //       2. The build is not working properly.
        //       3. NOT - state was mutated somewhere while the object was 
        //          being passed around the system. See functional programming.
        console.log('Selects: A select dropdown can only have one pre-selected value.');
        console.log(Object.keys(config.selected).length);
        console.log(config);
        return true;
      }

      return false;
    }

};

module.exports = Selects;
