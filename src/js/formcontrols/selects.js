var Selects;

Selects = {
    select: function(config) {

      if (this.isInvalidConfiguration(config)) {
        // configuration is not valid
        // return early without crash
        // errors logged in console
        return '';
      }

      // make configuration members concrete
      // required members
      var label = config.label;
      var name = config.name;

      var options = config.options;
      var hasSelected = (config.selected !== undefined && config.selected.indexOf(optionValue) > -1);
      
      var selectedValues = (hasSelected) 
        ? config.selected 
        : [];

      var hasDisabled = (config.disabled !== undefined && config.disabled.length > 0);
      var disabled = (hasDisabled) 
        ? config.disabled 
        : [];

      // build string parts
      var html = [];
      html.push('<div>');
      html.push('<label for="'+name+'">'+label+'</label>');

      if (hasDisabled) {
        html.push('<select id="'+name+'" name="'+name+'" disabled>');

      } else {
        html.push('<select id="'+name+'" name="'+name+'">');

      }
      
      for (var optionValue in options) {
        var optionConfig = {
          value: optionValue,
          title: options[optionValue],
          selected: selectedValues
        }
        var optionHtml = this.option(optionConfig);
        html.push(optionHtml);

      }
      html.push('</select>');
      html.push('</div>');

      // join parts
      return html.join('');
    },
    // @private
    option: function(config) {
      // do not need to validate this config, system-generated
      // make configuration members concrete
      var value = config.value;
      var title = config.title;
      var selected = (config.selected !== undefined && config.selected.length > 0) 
        ? ' selected' 
        : '';
      
      return '<option value="'+value+'"'+selected+'>'+title+'</option>';
    },
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
