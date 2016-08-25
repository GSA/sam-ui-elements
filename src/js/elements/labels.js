exports.label= {
	render : function(config) {
    	console.log(config.type);
    	var html = {
    		'small' : '<span class="usa-label">'+config.data+'</span>',
    		'large' : '<span class="usa-label-big">'+config.data+'</span>'
    	};
    	return (html[config.type] || html.small);
    }
};
