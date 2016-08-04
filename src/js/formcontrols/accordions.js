var Accordions;

Accordions = {
    Accordion: function(config) {
    	console.log(config.type);
    	var html = {
    		
    	};
    	return (html[config.type] || html['Primry-Default']);
    }
};

module.exports = Accordions;