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
      var label = config.label;
      var name = config.name;

      // build string parts
      var html = [];
      html.push('<div>');
      html.push('<label for="'+name+'">');
      html.push(label);
      html.push('</label>');
      html.push('<select name="'+name+'" id="'+name+'">');
      html.push('<option value="value1">Option A</option>');
      html.push('<option value="value2">Option B</option>');
      html.push('<option value="value3">Option C</option>');
      html.push('</select>');
      html.push('</div>');

      // join parts
      return html.join('');
    },
    isInvalidConfiguration(config) {

      if (config.label == undefined || config.label.length < 1) {
        console.log('Selects: "label" is required member.');
        console.log(config);
        return true;

      } else if (config.name == undefined || config.name.length < 1) {
        console.log('Selects: "name" is required member.');
        console.log(config);
        return true;

      } else if (config.type == undefined || config.type.length < 1) {
        console.log('Selects: "type" is required member.');
        console.log(config);
        return true;

      } else if (config.options == undefined || config.options.length < 1) {
        console.log('Selects: "options" is required member.');
        console.log(config);
        return true;

      }
      return false;
    }

};

module.exports = Selects;
