var Accordions;


  exports.accordions = function(config) {
         
      var html = [];

      var borderPrefix = '';
      if(config.bordered) {
        borderPrefix = '-bordered';
      }
      html.push('<div class="usa-accordion'+borderPrefix+'">');
      
      html.push('<ul class="usa-unstyled-list">');
      
      var expandedWasSet = false;
      var accordions = config.accordions;
      for (var i in accordions)
      {
        accordion = accordions[i];
        accordion.index = i;
        expanded = (accordion.expanded !== undefined && accordion.expanded === true);
        if (expandedWasSet && expanded) {
          // Only one expanded accordion possible.
          accordion.expanded = false;

        } else if (!expandedWasSet && expanded) {
          expandedWasSet = true;

        }

        html.push(module.exports.accordion(accordion));
      }
      
      html.push('</ul>');
      html.push('</div>');
      return html.join('');
  };
  exports.accordion= function(config) {

    var id = (config.index*1+1);
    var title = config.title;
    var content = config.content;

    var ariaExpanded = '';
    var ariaHidden = '';
    if (config.expanded !== undefined && config.expanded === true) {
      ariaExpanded = ' aria-expanded="true"';
      ariaHidden = ' aria-hidden="false"';
    }

    var html = [];
    html.push('<li>');
    html.push('<button class="usa-button-unstyled"'+ariaExpanded+' aria-controls="accordions-'+id+'">');
    html.push(title);
    html.push('</button>');
    html.push('<div id="accordions-'+id+'"'+ariaHidden+' class="usa-accordion-content">');
    html.push(content);
    html.push('</div>');
    html.push('</li>');

    return html.join('');
  };



