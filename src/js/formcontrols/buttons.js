var Buttons;

Buttons = {
    Button: function(config) {
    	console.log(config.type);
    	var html = {
    		'Primry-Default' : '<button>'+config.data+'</button>',
    		
    		'Primry-Default-Alt' : '<button class="usa-button-primary-alt">'+config.data+'</button>',
    		
            'Secondary-Default' : '<button class="usa-button-secondary">'+config.data+'</button>',
           
            'Secondary-Default-Gray' : '<button class="usa-button-gray">'+config.data+'</button>',
            
            'Secondary-Default-Outline' : '<button class="usa-button-outline type="button">'+config.data+'</button>',
            
            'Secondary-Default-Inv' : '<button class="usa-button-outline-inverse" type="button">'+config.data+'</button>',
            'Secondary-Active-Inv' : '<button class="usa-button-outline-inverse usa-button-active">'+config.data+'</button>',
            'Secondary-Hover-Inv' : '<button class="usa-button-outline-inverse usa-button-hover">'+config.data+'</button>',
            'Focus-Default' : '<button class="usa-button-focus">'+config.data+'</button>',
            'Focus-Primary' : '<button class="usa-button-primary-alt usa-button-focus">'+config.data+'</button>',
            'Focus-Secondary' : '<button class="usa-button-secondary usa-button-focus">'+config.data+'</button>',
            'Disbled' : '<button class="usa-button-disabled" disabled="">'+config.data+'</button>',
            'Big' : '<button class="usa-button-big" type="button">'+config.data+'</button>'
    	};
    	return (html[config.type] || html['Primry-Default']);
    }
};

module.exports = Buttons;