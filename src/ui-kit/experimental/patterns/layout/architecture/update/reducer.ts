import { DataStoreEvent, DataStore } from '../store';
import { modelType } from '../model';

export const layoutEvents = {
  DATA_CHANGED: 'DATA_CHANGED',
  FILTERS_CHANGED: 'FILTERS_CHANGED',
  PAGE_CHANGED: 'PAGE_CHANGED',
  SORT_CHANGED: 'SORT_CHANGED',
  ERROR: 'ERROR',
  VALUE_CHANGED: 'VALUE_CHANGED'
}

export function layoutReducer (state: any, action: DataStoreEvent): modelType {
  switch (action.type) {
    case 'VALUE_CHANGED':
      return action.payload;
    case 'data':
    case 'DATA_CHANGED':
      return {
        ...state,
        data: action.payload
      };
    case 'filters':
    case 'FILTERS_CHANGED':
      return {
        ...state,
        filters: action.payload
      };
    case 'pagination':
    case 'PAGE_CHANGED':
      return {
        ...state,
        pagination: action.payload
      };
    case 'sort':
    case 'SORT_CHANGED':
      return {
        ...state,
        sort: action.payload
      };
    case 'ERROR':
      return {
        ...state,
        data: action.payload
      };
    case 'filterFields':
      return {
        ...state,
        filterFields: action.payload
      };
    default:
      return state;
  }
}
