'use strict';
var expect = require('chai').expect;
var Pagination = require('../../../src/js/components/navigation/pagination.js');

/**
 * Pagination existence testing
 */
describe('pagination', function () {
  it('should exist', function () {
    expect(Pagination.pagination).to.not.be.undefined;
  });
});

/**
 * Pagination error handling testing
 */
describe('#PaginationErrorTest',function(){
  it('should return empty string when totalRecords is not defined', function () {
    var config = {
      currentPage: 1,
      offset: 20
    };

    var expected = '';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });

  it('should return empty string when totalRecords is less than 0', function () {
    var config = {
      totalRecords: -1,
      currentPage: 1,
      offset: 20
    };

    var expected = '';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });

  it('should return empty string when currentPage is not defined', function () {
    var config = {
      totalRecords: 100,
      offset: 20
    };

    var expected = '';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });

  it('should return empty string when currentPage is less than 0', function () {
    var config = {
      totalRecords: 10,
      currentPage: -1,
      offset: 20
    };

    var expected = '';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });

  it('should return empty string when currentPage is equal to 0', function () {
    var config = {
      totalRecords: 10,
      currentPage: 0,
      offset: 20
    };

    var expected = '';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });

  it('should return empty string when currentPage is greater than the total page', function () {
    var config = {
      totalRecords: 100,
      currentPage: 20,
      offset: 50
    };

    var expected = '';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });

  it('should return empty string when offset is not defined', function () {
    var config = {
      totalRecords: 100,
      currentPage: 20
    };

    var expected = '';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });

  it('should return empty string when offset is less than 0', function () {
    var config = {
      totalRecords: 10,
      offset: -1,
      currentPage: 2
    };

    var expected = '';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });

  it('should return empty string when offset is equal to 0', function () {
    var config = {
      totalRecords: 10,
      offset: 0,
      currentPage: 2
    };

    var expected = '';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });
});

/**
 * Test default pagination HTML format(without ellipsis)
 */
describe('#PaginationDefaultFormatTest', function () {
  it('should return empty string', function () {
    //should return empty string when there is no records
    var config = {
      currentPage: 1,
      totalRecords: 0,
      offset: 20
    };

    var expected = '';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });

  it('should return empty string', function () {
    //should return empty string when there is only 1 page
    var config = {
      currentPage: 1,
      totalRecords: 10,
      offset: 20
    };

    var expected = '';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });

  it('should return 10 page links with current page set as 5',function(){
    var config = {
      currentPage: 5,
      totalRecords: 100,
      offset: 10
    };

    var expected = '<nav class="usa-pagination" aria-label="pagination">'+
                      '<ul>'+
                        '<li><a aria-label="previous">&lsaquo; Prev</a></li>'+
                        '<li><a>1</a></li>'+
                        '<li><a>2</a></li>'+
                        '<li><a>3</a></li>'+
                        '<li><a>4</a></li>'+
                        '<li><a class="usa-current" aria-label="current">5</a></li>'+
                        '<li><a>6</a></li>'+
                        '<li><a>7</a></li>'+
                        '<li><a>8</a></li>'+
                        '<li><a>9</a></li>'+
                        '<li><a>10</a></li>'+
                        '<li><a aria-label="next">Next &rsaquo;</a></li>'+
                      '</ul>'+
                    '</nav>';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });

  it('should return 5 page links with current page set as 5',function(){
    var config = {
      currentPage: 5,
      totalRecords: 95,
      offset: 20
    };

    var expected = '<nav class="usa-pagination" aria-label="pagination">'+
                      '<ul>'+
                        '<li><a aria-label="previous">&lsaquo; Prev</a></li>'+
                        '<li><a>1</a></li>'+
                        '<li><a>2</a></li>'+
                        '<li><a>3</a></li>'+
                        '<li><a>4</a></li>'+
                        '<li><a class="usa-current" aria-label="current">5</a></li>'+
                      '</ul>'+
                    '</nav>';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });

  it('should return 5 page links with current page set as 1',function(){
    var config = {
      currentPage: 1,
      totalRecords: 95,
      offset: 20
    };

    var expected = '<nav class="usa-pagination" aria-label="pagination">'+
                      '<ul>'+
                        '<li><a class="usa-current" aria-label="current">1</a></li>'+
                        '<li><a>2</a></li>'+
                        '<li><a>3</a></li>'+
                        '<li><a>4</a></li>'+
                        '<li><a>5</a></li>'+
                        '<li><a aria-label="next">Next &rsaquo;</a></li>'+
                      '</ul>'+
                    '</nav>';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });
});

/**
 * Test pagination HTML format with ellipsis after the first page
 */
describe('#PaginationFrontEllipsisTest', function () {
  it('should return 11 page links, current page set as 6 and ellipsis should show after the first page',function(){
    var config = {
      currentPage: 6,
      totalRecords: 110,
      offset: 10
    };

    var expected = '<nav class="usa-pagination" aria-label="pagination">'+
                    '<ul>'+
                      '<li><a aria-label="previous">&lsaquo; Prev</a></li>'+
                      '<li><a>1</a></li>'+
                      '<li><span>&hellip;</span></li>'+
                      '<li><a>4</a></li>'+
                      '<li><a>5</a></li>'+
                      '<li><a class="usa-current" aria-label="current">6</a></li>'+
                      '<li><a>7</a></li>'+
                      '<li><a>8</a></li>'+
                      '<li><a>9</a></li>'+
                      '<li><a>10</a></li>'+
                      '<li><a>11</a></li>'+
                      '<li><a aria-label="next">Next &rsaquo;</a></li>'+
                    '</ul>'+
                  '</nav>';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });

  it('should return 22 page links, current page set as 22 and ellipsis should show after the first page',function(){
    var config = {
      currentPage: 22,
      totalRecords: 220,
      offset: 10
    };

    var expected = '<nav class="usa-pagination" aria-label="pagination">'+
                      '<ul>'+
                        '<li><a aria-label="previous">&lsaquo; Prev</a></li>'+
                        '<li><a>1</a></li>'+
                        '<li><span>&hellip;</span></li>'+
                        '<li><a>15</a></li>'+
                        '<li><a>16</a></li>'+
                        '<li><a>17</a></li>'+
                        '<li><a>18</a></li>'+
                        '<li><a>19</a></li>'+
                        '<li><a>20</a></li>'+
                        '<li><a>21</a></li>'+
                        '<li><a class="usa-current" aria-label="current">22</a></li>'+
                      '</ul>'+
                    '</nav>';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });
});

/**
 * Test pagination HTML format with ellipsis before the last page
 */
describe('#PaginationBackEllipsisTest', function () {
  it('should return 11 page links, current page set as 5 and ellipsis should show before the last page',function(){
    var config = {
      currentPage: 5,
      totalRecords: 110,
      offset: 10
    };

    var expected = '<nav class="usa-pagination" aria-label="pagination">'+
                      '<ul>'+
                        '<li><a aria-label="previous">&lsaquo; Prev</a></li>'+
                        '<li><a>1</a></li>'+
                        '<li><a>2</a></li>'+
                        '<li><a>3</a></li>'+
                        '<li><a>4</a></li>'+
                        '<li><a class="usa-current" aria-label="current">5</a></li>'+
                        '<li><a>6</a></li>'+
                        '<li><a>7</a></li>'+
                        '<li><a>8</a></li>'+
                        '<li><span>&hellip;</span></li>'+
                        '<li><a>11</a></li>'+
                        '<li><a aria-label="next">Next &rsaquo;</a></li>'+
                      '</ul>'+
                    '</nav>';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });

  it('should return 22 page links, current page set as 1 and ellipsis should show before the last page',function(){
    var config = {
      currentPage: 1,
      totalRecords: 220,
      offset: 10
    };

    var expected = '<nav class="usa-pagination" aria-label="pagination">'+
                      '<ul>'+
                        '<li><a class="usa-current" aria-label="current">1</a></li>'+
                        '<li><a>2</a></li>'+
                        '<li><a>3</a></li>'+
                        '<li><a>4</a></li>'+
                        '<li><a>5</a></li>'+
                        '<li><a>6</a></li>'+
                        '<li><a>7</a></li>'+
                        '<li><a>8</a></li>'+
                        '<li><span>&hellip;</span></li>'+
                        '<li><a>22</a></li>'+
                        '<li><a aria-label="next">Next &rsaquo;</a></li>'+
                      '</ul>'+
                    '</nav>';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });
});

/**
 * Test pagination HTML format with ellipsis both after the first page and before the last page
 */
describe('#PaginationFrontAndBackEllipsisTest', function () {
  it('should return 22 page links, current page set as 16 and ellipsis should show after the first page and before the last page',function(){
    var config = {
      currentPage: 16,
      totalRecords: 215,
      offset: 10
    };

    var expected = '<nav class="usa-pagination" aria-label="pagination">'+
                      '<ul>'+
                        '<li><a aria-label="previous">&lsaquo; Prev</a></li>'+
                        '<li><a>1</a></li>'+
                        '<li><span>&hellip;</span></li>'+
                        '<li><a>13</a></li>'+
                        '<li><a>14</a></li>'+
                        '<li><a>15</a></li>'+
                        '<li><a class="usa-current" aria-label="current">16</a></li>'+
                        '<li><a>17</a></li>'+
                        '<li><a>18</a></li>'+
                        '<li><a>19</a></li>'+
                        '<li><span>&hellip;</span></li>'+
                        '<li><a>22</a></li>'+
                        '<li><a aria-label="next">Next &rsaquo;</a></li>'+
                      '</ul>'+
                    '</nav>';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });

  it('should return 22 page links, current page set as 6 and ellipsis should show after the first page and before the last page',function(){
    var config = {
      currentPage: 6,
      totalRecords: 215,
      offset: 10
    };

    var expected = '<nav class="usa-pagination" aria-label="pagination">'+
      '<ul>'+
      '<li><a aria-label="previous">&lsaquo; Prev</a></li>'+
      '<li><a>1</a></li>'+
      '<li><span>&hellip;</span></li>'+
      '<li><a>3</a></li>'+
      '<li><a>4</a></li>'+
      '<li><a>5</a></li>'+
      '<li><a class="usa-current" aria-label="current">6</a></li>'+
      '<li><a>7</a></li>'+
      '<li><a>8</a></li>'+
      '<li><a>9</a></li>'+
      '<li><span>&hellip;</span></li>'+
      '<li><a>22</a></li>'+
      '<li><a aria-label="next">Next &rsaquo;</a></li>'+
      '</ul>'+
      '</nav>';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });

  it('should return 100 page links, current page set as 35 and ellipsis should show after the first page and before the last page',function(){
    var config = {
      currentPage: 35,
      totalRecords: 1000,
      offset: 10
    };

    var expected = '<nav class="usa-pagination" aria-label="pagination">'+
                      '<ul>'+
                        '<li><a aria-label="previous">&lsaquo; Prev</a></li>'+
                        '<li><a>1</a></li>'+
                        '<li><span>&hellip;</span></li>'+
                        '<li><a>32</a></li>'+
                        '<li><a>33</a></li>'+
                        '<li><a>34</a></li>'+
                        '<li><a class="usa-current" aria-label="current">35</a></li>'+
                        '<li><a>36</a></li>'+
                        '<li><a>37</a></li>'+
                        '<li><a>38</a></li>'+
                        '<li><span>&hellip;</span></li>'+
                        '<li><a>100</a></li>'+
                        '<li><a aria-label="next">Next &rsaquo;</a></li>'+
                      '</ul>'+
                    '</nav>';
    var actual = Pagination.pagination.render(config);
    expect(actual).to.eql(expected);
  });
});


