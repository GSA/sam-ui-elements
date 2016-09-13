/**
 * @Class Pagination
 *
 * With config object passed in, the render function will generate the pagination html string accordingly
 * The config object should contain the size of the page, current page and the step information.
 *
 *
 * @type {Object}
 *
 */
exports.pagination={
  html : '',

  /**
   *
   * @param config: config object needs to contain the totalPage, currentPage and offset porperties
   * totalPage: the size of pages
   * currentPage: the page that is currently selected
   * offset: the number of pages needs to show before and after the currentPage
   * @returns {string}
     */
  render: function(config){

    this.html += '<nav class="usa-pagination" aria-label="pagination"><ul>';
    this.html += this.getPreviousLink();
    this.html += this.getPageLinks(config);
    this.html += this.getNextLink();
    this.html += '</ul></nav>';
    return this.html;
  },

  /**
   * Get HTML string for previous link
   * @returns {string}
   */
  getPreviousLink: function(){
    var previousHtml = '<li><a aria-label="previous">&lsaquo; Pre</a></li>';
    return previousHtml;
  },

  /**
   * Get HTML string for next link
   * @returns {string}
   */
  getNextLink: function(){
    var nextHtml = '<li><a aria-label="next">Next &rsaquo;</a></li>';
    return nextHtml;
  },

  /**
   * Get the HTML string for all the pages according to config
   * @param config
   * @returns {string}
   */
  getPageLinks: function(config) {
    var pageLinksHtml = '';
    if (config.totalPage < config.offset * 2 + 6) {//default
      pageLinksHtml += this.enumeratePageLinks(1, config.totalPage + 1, config.currentPage);
    }
    else if (config.currentPage < config.offset * 2 + 1) {//check to add the last ellipsis
      pageLinksHtml += this.enumeratePageLinks(1, config.offset * 2 + 4, config.currentPage);
      pageLinksHtml += this.getLastPageLink(config);
    }
    else if (config.currentPage > config.totalPage - config.offset * 2) {//check to add the first ellipsis
      pageLinksHtml += this.getFirstLink(config);
      pageLinksHtml += this.enumeratePageLinks(config.totalPage - config.offset * 2 - 2, config.totalPage + 1, config.currentPage);
    }
    else {//add both the first and last ellipsis
      pageLinksHtml += this.getFirstLink(config);
      pageLinksHtml += this.enumeratePageLinks(config.currentPage - config.offset, config.currentPage + config.offset + 1, config.currentPage);
      pageLinksHtml += this.getLastPageLink(config);
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
   * @param currentPage
   * @returns {string}
   */
  enumeratePageLinks: function(start, end, currentPage) {
    var pagesHtml = '';
    for (var i = start; i < end; i++) {
      pagesHtml += this.AddPage(i,currentPage);
    }
    return pagesHtml;
  },

  /**
   * Get HTML string for the last page and ellipsis before it
   * @param config
   * @returns {string}
   */
  getLastPageLink: function(config) {
    var lastHtml = '';
    lastHtml += '<li><span>'+this.getEllipsis()+'</span></li>';
    lastHtml += this.AddPage(config.totalPage, config.currentPage);
    return lastHtml;
  },

  /**
   * Get HTML string for the first page and ellipsis after it
   * @param config
   * @returns {string}
   */
  getFirstLink: function(config) {
    var firstHtml = '';
    firstHtml += this.AddPage(1,config.currentPage);
    firstHtml += '<li><span>'+this.getEllipsis()+'</span></li>';
    return firstHtml;
  },

  /**
   * add a page link to the html string with a specific page number(index) state out
   * @param index: the page number
   * @returns {string}: the html string for the page
   * @constructor
   */
  AddPage: function(index, currentPage){
    var htmlStr = '<li><a';

    //Add class usa-current if it is the current step
    if(currentPage == index){
      htmlStr += ' class="usa-current"';
    }
    htmlStr += '>' + index + '</a></li>';
    return htmlStr;
  }



};
