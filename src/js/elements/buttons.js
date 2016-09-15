exports.button= {
    render : function(config) {
        // console.log(config.type);
        var html = {
            'default' : '<button>'+config.data+'</button>',         
            'alt' : '<button class="usa-button-primary-alt">'+config.data+'</button>',          
            'secondary' : '<button class="usa-button-secondary">'+config.data+'</button>',           
            'gray' : '<button class="usa-button-gray">'+config.data+'</button>',            
            'outline' : '<button class="usa-button-outline type="button">'+config.data+'</button>',            
            'inverted' : '<button class="usa-button-outline-inverse" type="button">'+config.data+'</button>', 
            'disbled' : '<button class="usa-button-disabled" disabled="'+config.disabled+'">'+config.data+'</button>',
            'big' : '<button class="usa-button-big" type="button">'+config.data+'</button>'
        };
        return (html[config.type] || html.primary);
    }
};
