var Buttons;

Buttons = {
    Button: function(config) {
    	console.log(config.type);
    	var html = {
    		'Primry-Default' : '<button>'+config.data+'</button>',
    		'Primary-Active' : '<button class="usa-button-active">'+config.data+'</button>',
    		'Primary-Hover' : '<button class="usa-button-hover">'+config.data+'</button>',
    		'Primry-Default-Alt' : '<button class="usa-button-primary-alt">'+config.data+'</button>',
    		'Primary-Active-Alt' : '<button class="usa-button-primary-alt usa-button-active">'+config.data+'</button>',
    		'Primary-Hover-Alt' : '<button class="usa-button-primary-alt usa-button-hover">'+config.data+'</button>'
    	};
    	return (html[config.type] || html['Primry-Default']);
    }
};

module.exports = Buttons;