import { DataStore } from '../store';
import { layoutReducer } from './reducer';
import { model } from '../model';

export const layoutStore = new DataStore(
  layoutReducer,
  model
);
