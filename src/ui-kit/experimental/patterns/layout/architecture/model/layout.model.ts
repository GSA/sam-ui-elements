export type modelType = {
  /**
   * Active filters, each property should be of type 'filterItemModel'
   */
  filters?: {},
  filterFields?: any[],
  pagination?: paginationModel,
  /**
   * 
   */
  data?: any,
  sort?: sortModel,
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
  totalSize: number,
  totalUnits: number
};

export const model: modelType = {
  filters: {},
  filterFields: [],
  pagination: {
    currentPage: undefined,
    pageSize: 10,
    totalSize: undefined,
    totalUnits: undefined
  },
  data: {},
  sort: {
    active: "",
    direction: ""
  }
};
