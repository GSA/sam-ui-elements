var Accordions;

Accordions = {
    Accordion: function(config) {
        
        
        var borderPrefix = '';
        if(config.bordered)
            borderPrefix = '-bordered';
        
        var html = '<div class="usa-accordion'+borderPrefix+'">'+
                          '<ul class="usa-unstyled-list">';
        var data = config.data;
        var expandedSet = false;
        for (var i in data)
        {
            var expanded = data[i].expanded == undefined ? false : (!expandedSet && data[i].expanded);           
            html = html+
                   '<li>'+
                        '<button class="usa-button-unstyled" aria-expanded="'+expanded+'" aria-controls="accordions-'+(i*1+1)+'">'+
                            data[i].title+
                        '</button>'+
                        '<div id="accordions-'+(i*1+1)+'" aria-hidden="'+!expanded+'" class="usa-accordion-content">'+
                            data[i].content+
                        '</div>'+
                    '</li>';

            if(data[i].expanded != undefined && data[i].expanded)
                expandedSet = true;
        }
                           
        html = html+'</ul></div>';
        return html;
    }
};

module.exports = Accordions;