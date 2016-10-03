exports.searchResult={
  render : function(config, data) {
      var html = '';
      if(config.type == 'assistance'){
        var listhtml = '';
        if(data.fhName && data.fhNames[0] !== undefined){ listhtml += '<li><strong>Department:</strong> <a href="#"><span>' + data.fhNames[0] + '</span></a></li>'; }
        if(data.fhName && data.fhNames[1] !== undefined){ listhtml += '<li><strong>Agency:</strong> <a href="#"><span>' + data.fhNames[1] + '</span></a></li>'; }
        if(data.fhName && data.fhNames[2] !== undefined){ listhtml += '<li><strong>Office:</strong> <a href="#"><span>' + data.fhNames[2] + '</span></a></li>'; }
        if(data.contacts && data.contacts[0] !== undefined){ listhtml += '<li><strong>Headquarters Office:</strong> ' + data.contacts[0].fullName + ', ' + data.contacts[0].address + ' ' + data.contacts[0].city + '</li>'; }

        html = '<div class="usa-grid usa-search-result">' +
          '<span class="usa-label">Federal Assistance Listing</span>' +
          '<h3>' +
            '<a href="' + data.url + '">' + data.title + '</a>' +
          '</h3>' +
          '<div class="usa-width-two-thirds">' +
            '<p>' + data.objective + '</p>' +
            '<ul class="usa-unstyled-list usa-text-small">' + listHtml + '</ul>' +
          '</div>' +
          '<div class="usa-width-one-third">' +
            '<ul class="usa-text-small">' +
              '<li><strong>FAL Number</strong>' +
                '<ul class="usa-unstyled-list">' +
                  '<li>' + data.programNumber + '</li>' +
                '</ul>' +
              '</li>' +
              '<li><strong>Date Published</strong>' +
                '<ul class="usa-unstyled-list">' +
                  '<li>' + data.publishedDate + '</li>' +
                '</ul>' +
              '</li>' +
              '<li><strong>Type</strong>' +
                '<ul class="usa-unstyled-list">' +
                  '<li>' + data.assistanceTypes + '</li>' +
                '</ul>' +
              '</li>' +
            '</ul>' +
          '</div>' +
        '</div>';
      } else if (config.type == 'opportunity') {
        var procurementDescriptionHTML = '';
        if(data.procurementDescription != null){
          procurementDescriptionHTML = '<p>' + data.procurementDescription + '</p>';
        }
        html = '<div class="usa-grid usa-search-result">' +
          '<span class="usa-label">OPPORTUNITY</span>' +
          '<h3>' +
            '<a href="' + data.url + '">' + data.procurementTitle + '</a>' +
          '</h3>' +
          '<div class="usa-width-two-thirds">' +
            procurementDescriptionHTML +
            '<ul class="usa-unstyled-list usa-text-small">' +
              '<li><strong>Department:</strong> <a href="#">' + data.parentAgencyName + '</a></li>' +
              '<li><strong>Office:</strong> <a href="#">' + data.officeName + '</a></li>' +
              '<li><strong>Location:</strong> ' + data.location + '</li>' +
            '</ul>' +
          '</div>' +
          '<div class="usa-width-one-third">' +
            '<ul class="usa-text-small">' +
              '<li>' +
                '<strong>Solicitation Number</strong>' +
                '<ul class="usa-unstyled-list">' +
                  '<li>' + data.solicitationNumber + '</li>' +
                '</ul>' +
              '</li>' +
              '<li>' +
                '<strong>Posted Date</strong>' +
                '<ul class="usa-unstyled-list">' +
                  '<li>' + data.procurementPostedDate + '</li>' +
                '</ul>' +
              '</li>' +
              '<li>' +
                '<strong>Type</strong>' +
                '<ul class="usa-unstyled-list">' +
                  '<li>' + data.procurementTypeValue + '</li>' +
                '</ul>' +
              '</li>' +
            '</ul>' +
          '</div>' +
        '</div>';
      } 

      return html;
    }
};
