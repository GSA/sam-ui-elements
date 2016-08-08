var Selects;

Selects = {
    select: function(config) {

      // build string parts
      var html = [];
      html.push('<div>');
      html.push('<label for="options">Dropdown label</label>');
      html.push('<select name="options" id="options">');
      html.push('<option value="value1">Option A</option>');
      html.push('<option value="value2">Option B</option>');
      html.push('<option value="value3">Option C</option>');
      html.push('</select>');
      html.push('</div>');

      // join parts
      return html.join('');
    }
};

module.exports = Selects;
