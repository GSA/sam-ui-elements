var Selects;

Selects = {
    select: function(config) {

      if (this.isInvalidConfiguration(config)) {
        // configuration is not valid
        // return early without crash
        return '';
      }

      // make configuration members concrete
      var label = config.label;

      // build string parts
      var html = [];
      html.push('<div>');
      html.push('<label for="options">');
      html.push(label);
      html.push('</label>');
      html.push('<select name="options" id="options">');
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
        console.log('Selects: invalid configuration.');
        console.log('Selects: label is required member.');
        console.log(config);
        return true;
      }
      return false;
    }

};

module.exports = Selects;
