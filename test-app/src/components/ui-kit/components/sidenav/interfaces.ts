/**
 * Interface for Sam Sidenav Component
 * Label is the visible text for each menu item
 * Route is an optional parameter for the path for your router. Routes will be 
 * concatenated as lower levels are of the sidenav are clicked. Routes should 
 * include a leading '/' if it is a child route or '#' if it is an anchor.
 * Children is an array of MenuItems that will be displayed as a child list 
 * when the parent is clicked in the sidenav.
 */
export interface MenuItem {
  label: string;
  route?: string;
  disabled?: boolean;
  children?: MenuItem[];
  iconClass?: string;
  id?: string;
}
