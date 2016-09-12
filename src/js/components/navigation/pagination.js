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

  render: function(config){

    // converting initialize config data
    this.size = config.size || 300;
    this.page = config.page || 1;
    this.step = config.step || 3;

    this.html += '<nav class="usa-pagination" aria-label="pagination"><ul><li><a>&lsaquo;</a></li>';// previous button
    this.Start();  // Add the page numbers
    this.html += '<li><a>&rsaquo;</a></li></ul></nav>';  // next button
    return this.html;
  },

  /**
   * find pagination type
   * @constructor
   */
  Start: function() {
    if (this.size < this.step * 2 + 6) {
      this.Add(1, this.size + 1);
    }
    else if (this.page < this.step * 2 + 1) {
      this.Add(1, this.step * 2 + 4);
      this.Last();
    }
    else if (this.page > this.size - this.step * 2) {
      this.First();
      this.Add(this.size - this.step * 2 - 2, this.size + 1);
    }
    else {
      this.First();
      this.Add(this.page - this.step, this.page + this.step + 1);
      this.Last();
    }
  },

  // --------------------
  // Utility
  // --------------------

  /**
   * add pages by number (from [s] to [f])
   * @param s: start index
   * @param f: final index
   * @constructor
   */
  Add: function(s, f) {
    for (var i = s; i < f; i++) {
      this.html += this.AddPage(i);
    }
  },

  /**
   * add last page with separator
   * @constructor
   */
  Last: function() {
    this.html += '<li><span>&hellip;</span></li>';
    this.html += this.AddPage(this.size);
  },

  /**
   * add first page with separator
   * @constructor
   */
  First: function() {
    this.html += this.AddPage(1);
    this.html += '<li><span>&hellip;</span></li>';
  },

  /**
   * add a page link to the html string with a specific page number(index) state out
   * @param index: the page number
   * @returns {string}: the html string for the page
   * @constructor
   */
  AddPage: function(index){
    var html_str = '<li><a';

    //Add class usa-current if it is the current step
    if(this.page == index){
      html_str += ' class="usa-current"';
    }
    html_str += '>' + index + '</a></li>';
    return html_str;
  }


};
