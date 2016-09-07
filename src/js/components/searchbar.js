exports.searchbar = {
  render : function(config) {    
    var gridclass = 'usa-width-three-fourths';
    var searchAttributes = '';
    if(config.width){
      gridclass = config.width;
    }
    if(config.searchAttributes){
      searchAttributes = config.searchAttributes;
    }
    var html = [];

    html.push('<div role="search" class="'+gridclass+'">');
    html.push('<label class="usa-sr-only" for="search-field-big">Search big</label>');
    html.push('<input id="search-field-big" type="search" name="keyword" placeholder="#keyword" autofocus '+config.searchAttributes+'>');
    html.push('<button type="submit">');
    html.push('<span class="usa-search-submit-text">Search</span>');
    html.push('</button>');
    html.push('</div>');

    return html.join('');

  }
};