/**
 * @Class Pagination
 *
 * With config object passed in, the render function will generate the pagination html string accordingly
 * The config object should contain total number of records, current page and the offset information.
 *
 *
 * @type {Object}
 *
 */
exports.pagination = {
  range: 3, // The number of pages before and after the current page
  threshold: 6, // The threshold to check whether ellipsis is needed

  /**
   * The enter method for developers to use which will generate the complete HTML string depending on the config object
   * @param config: config object needs to contain the totalRecords, currentPage and offset properties
   * totalRecords: the total number of records
   * currentPage: the page that is currently selected
   * offset: the number of records that will be displayed in one page
   * @returns {string}
   */
  render: function (config) {

    if (this.isInvalidConfiguration(config)) {
      // Return early if the configuration is invalid
      return '';
    }

    // If the configuration is valid, still return empty string when:
    // 1. There are no records at all
    // 2. The records are not enough to fill in the first page
    if (this.getTotalPages(config) <= 1) {
      // Return empty string if there are 1 or less page
      return '';
    }

    var html = '';
    html += '<nav class="usa-pagination" aria-label="pagination"><ul>';
    html += this.getPreviousLink(config);
    html += this.getPageLinks(config);
    html += this.getNextLink(config);
    html += '</ul></nav>';

    return html;
  },

  /**
   * Get HTML string for previous link
   * @returns {string}
   */
  getPreviousLink: function (config) {

    // No previous link when the current page is 1
    if (config.currentPage > 1) {
      return '<li><a aria-label="previous">&lsaquo; Prev</a></li>';
    }
    return '';
  },

  /**
   * Get HTML string for next link
   * @returns {string}
   */
  getNextLink: function (config) {

    // No next link when the currentPage is equal to totalPages
    if (config.currentPage < this.getTotalPages(config)) {
      return '<li><a aria-label="next">Next &rsaquo;</a></li>';
    }
    return '';
  },


  /**
   * Get the HTML string for all the pages according to config
   * @assumptions: the range to show pages before and after the current page is 3, max page links can be displayed on screen is 9
   * @returns {string}
   */
  getPageLinks: function (config) {
    var pageLinksHtml = [];
    pageLinksHtml.push(this.getPageLink(1, config));//Add the first page link

    var start = 2;
    var end = this.getTotalPages(config) - 1;
    // If total number of pages less than or equal to 10, then display all page links
    // Otherwise, use the algorithm to calculate the start and end page to show between the first and last page
    if(end > 9){
      // If the current page is less than the threshold, then display first 8 page links followed by ellipsis and the last page link
      if(config.currentPage < this.threshold){
        end = 8;
      }
      // If the current page is greater than the total page minus threshold, then display the first page link followed by ellipsis and the last 8 page links
      else if(config.currentPage > this.getTotalPages(config) - this.threshold){
        start = end - 6;
      }
      // For all other conditions, display the first page link followed by ellipsis and three links before and after the current page followed by ellipsis and the last page link
      else{
        start = config.currentPage - this.range;
        end = config.currentPage + this.range;
      }
    }

    pageLinksHtml.push(this.getEnumeratePageLinks(start,end,config));//Add HTMl string between the first page and last page
    pageLinksHtml.push(this.getPageLink(this.getTotalPages(config), config));//Add the last page link
    return pageLinksHtml.join('');
  },

  /**
   * Get ellipsis wrapped as a span in a list item
   * @returns {string}
   */
  getEllipsis: function () {
    return '<li><span>&hellip;</span></li>';
  },

  /**
   * Get the total pages from configuration
   * @returns {number}
   */
  getTotalPages: function (config) {
    return Math.ceil(config.totalRecords / config.offset);
  },

  /**
   * Get HTML string for page number between start index and end index with ellipsis added if necessary
   * @param start
   * @param end
   * @returns {string}
   */
  getEnumeratePageLinks: function (start, end, config) {
    var pagesHtml = [];

    // Add ellipsis at the front, if the start index is larger than 2
    if(start > 2){
      pagesHtml.push(this.getEllipsis());
    }

    for (var i = start; i <= end; i++) {
      pagesHtml.push(this.getPageLink(i, config));
    }

    // Add ellipsis at the end, if the end index is less than total page minus 1
    if(end < this.getTotalPages(config) - 1){
      pagesHtml.push(this.getEllipsis());
    }
    return pagesHtml.join('');
  },

  /**
   * Generate a page link html string using a specific page number(index)
   * @param index: the page number
   * @returns {string}: the html string for the page number
   *
   */
  getPageLink: function (index, config) {
    var htmlStr = '<li><a';

    //Add css class and aria-label if it is the current step
    if (config.currentPage === index) {
      htmlStr += ' class="usa-current" aria-label="current"';
    }
    htmlStr += '>' + index + '</a></li>';
    return htmlStr;
  },

  /**
   * Check whether the config message is correct or not
   * @param config: the configuration object for pagination
   * @returns {boolean} Whether the configuration is invalid or not
   */
  isInvalidConfiguration: function (config) {
    //Check whether the config contains three variables: totalRecords, currentPage and offset
    if (config.totalRecords === undefined || config.totalRecords < 0) {
      console.log('Pagination: "totalRecords" is required member. And must have value larger than or equal to 0.');
      console.log(config);
      return true;

    } else if (config.offset === undefined || config.offset <= 0) {
      console.log('Pagination: "offset" is required member. And must have value larger than 0.');
      console.log(config);
      return true;

    } else if (config.currentPage === undefined || config.currentPage <= 0) {
      console.log('Pagination: "currentPage" is required member. And must have value larger than 0.');
      console.log(config);
      return true;

    }
    // Check whether the current page is greater than the total page
    if (config.currentPage > this.getTotalPages(config)) {
      console.log('Pagination: "currentPage" cannot be greater than total page.');
      console.log(config);
      return true;
    }

    return false;
  }

};
