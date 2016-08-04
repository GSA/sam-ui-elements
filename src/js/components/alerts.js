var Alerts;

Alerts = {
    Alert: function(config) {
      console.log(config.type);
      var html = {
        'Success' : '<div class="usa-alert usa-alert-success">'+
                            '<div class="usa-alert-body">'+
                              '<h3 class="usa-alert-heading">'+config.title+'</h3>'+
                              '<p class="usa-alert-text">'+config.description+'</p>'+
                            '</div>'+
                          '</div>',
        'Warning' : '<div class="usa-alert usa-alert-warning">'+
                            '<div class="usa-alert-body">'+
                              '<h3 class="usa-alert-heading">'+config.title+'</h3>'+
                              '<p class="usa-alert-text">'+config.description+'</p>'+
                            '</div>'+
                          '</div>',
        'Error' : '<div class="usa-alert usa-alert-error">'+
                            '<div class="usa-alert-body">'+
                              '<h3 class="usa-alert-heading">'+config.title+'</h3>'+
                              '<p class="usa-alert-text">'+config.description+'</p>'+
                            '</div>'+
                          '</div>',
        'Info' : '<div class="usa-alert usa-alert-info">'+
                            '<div class="usa-alert-body">'+
                              '<h3 class="usa-alert-heading">'+config.title+'</h3>'+
                              '<p class="usa-alert-text">'+config.description+'</p>'+
                            '</div>'+
                          '</div>'
      };
      return (html[config.type] || html['Success']);
    }
};

module.exports = Alerts;


  

