var Selects;

Selects = {
    select: function(config) {

      if (this.isInvalidConfiguration(config)) {
        // configuration is not valid
        // return early without crash
        return '';
      }

      // make configuration members concrete
      // required members
      var label   = config.label;
      var name    = config.name;
      var options = config.options;

      // build string parts
      var html = [];
      html.push('<div>');
      html.push('<label for="'+name+'">');
      html.push(label);
      html.push('</label>');
      html.push('<select name="'+name+'" id="'+name+'">');
      for (var optionValue in options) {
        var optionConfig = {
          value: optionValue,
          title: options[optionValue]
        }
        var optionHtml = this.option(optionConfig);
        html.push(optionHtml);

      }
      html.push('</select>');
      html.push('</div>');

      // join parts
      return html.join('');
    },
    option: function(config) {
      // do not need to validate this config, system-generated
      // make configuration members concrete
      var value = config.value;
      var title = config.title;
      
      return '<option value="'+value+'">'+title+'</option>';
    },
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

      }
      return false;
    }

};

module.exports = Selects;
