exports.alert={
  render : function(config) {
      // console.log('Alert:'+config.type);
      var html = {
        'success' : '<div class="usa-alert usa-alert-success">'+
                            '<div class="usa-alert-body">'+
                              '<h3 class="usa-alert-heading">'+config.title+'</h3>'+
                              '<p class="usa-alert-text">'+config.description+'</p>'+
                            '</div>'+
                          '</div>',
        'warning' : '<div class="usa-alert usa-alert-warning">'+
                            '<div class="usa-alert-body">'+
                              '<h3 class="usa-alert-heading">'+config.title+'</h3>'+
                              '<p class="usa-alert-text">'+config.description+'</p>'+
                            '</div>'+
                          '</div>',
        'error' : '<div class="usa-alert usa-alert-error">'+
                            '<div class="usa-alert-body">'+
                              '<h3 class="usa-alert-heading">'+config.title+'</h3>'+
                              '<p class="usa-alert-text">'+config.description+'</p>'+
                            '</div>'+
                          '</div>',
        'info' : '<div class="usa-alert usa-alert-info">'+
                            '<div class="usa-alert-body">'+
                              '<h3 class="usa-alert-heading">'+config.title+'</h3>'+
                              '<p class="usa-alert-text">'+config.description+'</p>'+
                            '</div>'+
                          '</div>'
      };
      return (html[config.type] || html.success);
    }
};
