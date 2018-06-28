export type modelType = {
  /**
   * Active filters, each property should be of type 'filterItemModel'
   */
  filters?: {},
  pagination?: paginationModel,
  /**
   * 
   */
  data?: any,
  sort?: sortModel,
  actions?: any
}

//single column sort
export type sortModel = {
  /**
   * Active sorted column
   */
  active: string,
  /**
   * Sorted column direction
   */
  direction: "" | "asc" | "desc"
};

export type paginationModel = {
  currentPage: number,
  pageSize: number,
  totalSize: number
};

export const model: any = {
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
  },
  actions: {}
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
