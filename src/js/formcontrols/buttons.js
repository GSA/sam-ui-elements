var Buttons;

Buttons = {
    Button: function(config) {
    	console.log(config.type);
    	var html = {
    		'primary' : '<button>'+config.data+'</button>',    		
    		'primary-alt' : '<button class="usa-button-primary-alt">'+config.data+'</button>',    		
            'secondary' : '<button class="usa-button-secondary">'+config.data+'</button>',           
            'secondary-gray' : '<button class="usa-button-gray">'+config.data+'</button>',            
            'secondary-outline' : '<button class="usa-button-outline type="button">'+config.data+'</button>',            
            'secondary-inv' : '<button class="usa-button-outline-inverse" type="button">'+config.data+'</button>', 
            'disbled' : '<button class="usa-button-disabled" disabled="'+config.disabled+'">'+config.data+'</button>',
            'big' : '<button class="usa-button-big" type="button">'+config.data+'</button>'
    	};
    	return (html[config.type] || html['primary']);
    }
};

module.exports = Buttons;