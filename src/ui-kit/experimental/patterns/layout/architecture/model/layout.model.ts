export type model = {
  filters?: {},
  pagination?: paginationModel,
  data?: any,
  sort?: sortModel
}

//single column sort
export type sortModel = {
  /**
   * Active sorted column
   */
  active: string,
  /**
   * 
   */
  direction: "" | "asc" | "desc"
};

export type paginationModel = {
  currentPage: number,
  pageSize: number,
  totalSize: number
};

export const model: model = {
  filters: {},
  pagination: {
    currentPage: undefined,
    pageSize: 10,
    totalSize: undefined
  },
  data: {},
  sort: {
    active: "",
    direction: ""
  }
};

/**
 * id - some program friendly identifier
 * 
 */
export type filterItemModel = {
  /**
   * program-friendly string identifier
   */
  id: string,
  /**
   * visible filter label
   */
  label: string,
  /**
   * current filter value
   */
  value: any,
  /**
   * filter category to help group certain ones together
   */
  category?: string
};
