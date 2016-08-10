var Selects;

Selects = {
    select: function(config) {

      if (this.isInvalidConfiguration(config)) {
        // configuration is not valid
        // return early without crash
        // errors logged in console
        return '';
      }

      html = '<div>';
      html += this.getOpening(config);
      html += this.getOptions(config);
      html += this.getClosing(config);
      html += '</div>';
      
      return html;
    },
    // @private
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
        opening.push('<label for="'+config.name+'">'+config.label+'</label>');        
        opening.push('<select id="'+config.name+'" name="'+config.name+'"'+disabled+'>');

      }
      return opening.join('');
    },
    // @private
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
    // @private
    getOptions: function(config) {
      // make configuration members concrete
      // required members
      var disabled = this.disabled(config);
      var selected = this.selected(config);

      // build options
      var optionHtml = [];
      for (var optionValue in config.options) {
        var optionConfig = {
          type: config.type,
          name: config.name,
          value: optionValue,
          title: config.options[optionValue],
          selected: selected,
          disabled: disabled
        }
        var html = this.option(optionConfig);
        optionHtml.push(html);

      }
      return optionHtml.join('');
    },    
    // @private
    option: function(config) {
      // do not need to validate this config, system-generated
      // make configuration members concrete
      var type = config.type;
      var name = config.name;
      var value = config.value;
      var title = config.title;
      var selected = (config.selected !== undefined && config.selected.indexOf(value) > -1) 
        ? ' selected' 
        : '';

      var html = [];
      if (type == 'radio' || type == 'checkbox') {
        //TODO: Make these method calls
        var hasDisabled = (config.disabled !== undefined && config.disabled.length > 0);
        var disabled = (hasDisabled) 
          ? config.disabled 
          : [];
        html.push('<li>');

        if (hasDisabled && disabled.indexOf(value) > -1) {
          html.push('<input id="'+value+'" type="'+type+'" name="'+name+'" value="'+value+'" disabled>');

        } else {
          html.push('<input id="'+value+'" type="'+type+'" name="'+name+'" value="'+value+'">');

        }
        html.push('<label for="'+value+'">'+title+'</label>');
        html.push('</li>');

      } else {
        html.push('<option value="'+value+'"'+selected+'>'+title+'</option>');

      }
      
      return html.join('');
    },
    // @private
    hasDisabled: function(config) {
      return (config.disabled !== undefined && config.disabled.length > 0);      
    },
    // @private
    disabled: function(config) {
      return (this.hasDisabled(config)) 
        ? config.disabled 
        : [];
    },
    // @private
    hasSelected: function(config) {
      return (config.selected !== undefined && config.selected.length > 0);
    },
    selected: function(config) {
      return (this.hasSelected(config)) 
        ? config.selected 
        : [];
    },
    // @private
    // @private
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

      } else if (config.selected !== undefined && config.selected.length > 1) {
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
