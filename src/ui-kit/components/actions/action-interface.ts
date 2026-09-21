export interface SamActionInterface {
  icon?: string;
  label: string;
  name: string;
  callback?: (...args: never[]) => unknown;
}
