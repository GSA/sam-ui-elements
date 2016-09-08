exports.searchbar = {
  render : function(config) {    
    var id = 'search-field-big';
    var type = '';
    var method = 'POST';
    if(config.type && config.type==='big'){
      type = ' usa-search-big';
    }
    else if(config.type && config.type==='small'){
      type = ' usa-search-small';
    }

    if(config.method && config.method==='GET'){
      method = config.method;
    }
    var html = [];

    html.push('<form class="usa-search'+type+'" method="'+method+'">');
    html.push('<div class="usa-width-one-fourth">');
    html.push('<label for="index" class="usa-sr-only">Select an index</label>');
    html.push('<select name="index">');
    html.push('<option selected="true">Assistance Listings</option>');
    html.push('<option>Opportunities</option>');
    html.push('</select>');
    html.push('</div>');
    html.push('<div role="search" class="usa-width-three-fourths">');
    html.push('<label class="usa-sr-only" for="'+id+'">Search</label>');
    html.push('<input id="'+id+'" type="search" name="keyword" placeholder="#keyword" autofocus>');
    html.push('<button type="submit">');
    html.push('<span class="usa-search-submit-text">Search</span>');
    html.push('</button>');
    html.push('</div>');
    html.push('</form>');

    return html.join('');

  }
};