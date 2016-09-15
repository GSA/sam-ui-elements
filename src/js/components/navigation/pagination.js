
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
exports.pagination={
  range:3, // The number of pages before and after the current page
  threshold: 6, // The threshold to check whether ellipsis is needed
  totalPages: 0, // Total number of pages
  currentPage: 0, // The page that is currently selected

  /**
   * The enter method for developers to use which will generate the complete HTML string depending on the config object
   * @param config: config object needs to contain the totalRecords, currentPage and offset properties
   * totalRecords: the total number of records
   * currentPage: the page that is currently selected
   * offset: the number of records that will be displayed in one page
   * @returns {string}
   */
  render: function(config){

    if(this.isInvalidConfiguration(config)){
      // Return early if the configuration is invalid
      return '';
    }

    this.totalPages = Math.ceil(config.totalRecords/config.offset);
    this.currentPage = config.currentPage;
    if(this.totalPages <= 1){
      // Return empty string if there are 1 or less page
      return '';
    }

    var html = '';
    html += '<nav class="usa-pagination" aria-label="pagination"><ul>';
    html += this.getPreviousLink();
    html += this.getPageLinks();
    html += this.getNextLink();
    html += '</ul></nav>';

    return html;
  },

  /**
   * Get HTML string for previous link
   * @returns {string}
   */
  getPreviousLink: function(){

    // No previous link when the current page is 1
    if(this.currentPage === 1){
      return '';
    }
    return '<li><a aria-label="previous">&lsaquo; Prev</a></li>';
  },

  /**
   * Get HTML string for next link
   * @returns {string}
   */
  getNextLink: function(){

    // No next link when the currentPage is equal to totalPages
    if(this.currentPage === this.totalPages){
      return '';
    }
    return '<li><a aria-label="next">Next &rsaquo;</a></li>';
  },


  /**
   * Get the HTML string for all the pages according to config
   * @assumptions: the offset is 3, max page links can be displayed on screen is 9
   * @returns {string}
   */
  getPageLinks: function() {
    var pageLinksHtml = '';
    var start, end;
    // Total number of pages less than or equal to 10, then display all page links
    if (this.totalPages <= 10) {
      start = 1;
      end = this.totalPages;
      pageLinksHtml += this.enumeratePageLinks(start, end);
    }
    // If the current page is less than 6, then display first 8 page links followed by ellipsis and the last page link
    else if (this.currentPage < this.threshold) {
      start = 1;
      end = 8;
      pageLinksHtml += this.enumeratePageLinks(start, end);
      pageLinksHtml += this.getLastPageLink();
    }
    // If the current page is greater than the total page minus 6, then display the first page link followed by ellipsis and the last 8 page links
    else if (this.currentPage > this.totalPages - this.threshold) {
      start = this.totalPages - 7;
      end = this.totalPages;
      pageLinksHtml += this.getFirstLink();
      pageLinksHtml += this.enumeratePageLinks(start, end);
    }
    // For all other conditions, display the first page link followed by ellipsis and three links before and after the current page followed by ellipsis and the last page link
    else {
      start = this.currentPage - this.range;
      end = this.currentPage + this.range;
      pageLinksHtml += this.getFirstLink();
      pageLinksHtml += this.enumeratePageLinks(start, end);
      pageLinksHtml += this.getLastPageLink();
    }
    return pageLinksHtml;
  },

  /**
   * Get unicode for ellipsis
   * @returns {string}
   */
  getEllipsis: function(){
    return '&hellip;';
  },

  /**
   * Get HTML string for page number between start index and end index
   * @param start
   * @param end
   * @returns {string}
   */
  enumeratePageLinks: function(start, end) {
    var pagesHtml = '';
    for (var i = start; i <= end; i++) {
      pagesHtml += this.getPageLink(i);
    }
    return pagesHtml;
  },

  /**
   * Get HTML string for the last page and ellipsis before it
   * @returns {string}
   */
  getLastPageLink: function() {
    var lastHtml = '';
    lastHtml += '<li><span>'+this.getEllipsis()+'</span></li>';
    lastHtml += this.getPageLink(this.totalPages);
    return lastHtml;
  },

  /**
   * Get HTML string for the first page and ellipsis after it
   * @returns {string}
   */
  getFirstLink: function() {
    var firstHtml = '';
    firstHtml += this.getPageLink(1);
    firstHtml += '<li><span>'+this.getEllipsis()+'</span></li>';
    return firstHtml;
  },

  /**
   * Generate a page link html string using a specific page number(index)
   * @param index: the page number
   * @returns {string}: the html string for the page number
   *
   */
  getPageLink: function(index){
    var htmlStr = '<li><a';

    //Add class and aria-label if it is the current step
    if(this.currentPage === index){
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
  isInvalidConfiguration: function(config) {
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
    if(config.currentPage > Math.ceil(config.totalRecords/config.offset)){
      console.log('Pagination: "currentPage" cannot be greater than total page.');
      console.log(config);
      return true;
    }

    return false;
  }

};
