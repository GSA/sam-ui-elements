var Labels;

Labels = {
    Label: function(config) {
    	console.log(config.type);
    	var html = {
    		'Small' : '<span class="usa-label">'+config.data+'</span>',
    		'Large' : '<span class="usa-label-big">'+config.data+'</span>'
    	};
    	return (html[config.type] || html['Small']);
    }
};

module.exports = Labels;