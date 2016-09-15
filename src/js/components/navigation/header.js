/**
 * @Class Selects
 * 
 * @type {Object}
 */
exports.header = {
  render: function(config) {

    var html = '';
    html += '<header class="sam-header">';
    html += '<nav aria-label="Main navigation">';
    html += '<ul class="usa-grid usa-unstyled-list">';
    html += '<li><a class="sam-home" href="/"><span>The future SAM.gov</span></a></li>';
    html += '<li><a class="sam-search" href="/search/"><span>Search</span></a></li>';
    html += '</ul>';
    html += '</nav>';
    html += '</header>';

  	return html;
  }
};
