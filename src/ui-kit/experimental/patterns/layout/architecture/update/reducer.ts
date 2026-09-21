import { DataStoreEvent } from "../store";
import { modelType } from "../model";

export const layoutEvents = {
  DATA_CHANGED: "DATA_CHANGED",
  FILTERS_CHANGED: "FILTERS_CHANGED",
  PAGE_CHANGED: "PAGE_CHANGED",
  SORT_CHANGED: "SORT_CHANGED",
  ERROR: "ERROR",
  VALUE_CHANGED: "VALUE_CHANGED",
};

export function layoutReducer(
  state: modelType,
  action: DataStoreEvent
): modelType {
  switch (action.type) {
    case "VALUE_CHANGED":
      return action.payload as modelType;
    case "data":
    case "DATA_CHANGED":
      return {
        ...state,
        data: action.payload,
      };
    case "filters":
    case "FILTERS_CHANGED":
      return {
        ...state,
        filters: action.payload as Record<string, unknown>,
      };
    case "pagination":
    case "PAGE_CHANGED":
      return {
        ...state,
        pagination: action.payload as modelType["pagination"],
      };
    case "sort":
    case "SORT_CHANGED":
      return {
        ...state,
        sort: action.payload as modelType["sort"],
      };
    case "ERROR":
      return {
        ...state,
        data: action.payload,
      };
    case "filterFields":
      return {
        ...state,
        filterFields: action.payload as unknown[],
      };
    default:
      return state;
  }
}
