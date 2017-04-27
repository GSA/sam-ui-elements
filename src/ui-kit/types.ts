export interface OptionsType {
  /**
   * The model value
   */
  value: string | number;
  /**
   * The visible text for the input or option
   */
  label: string;
  /**
   * The machine readable description of the input
   */
  name: string; 
  /**
   * if true, the option is greyed out and not clickable
   */
  disabled?: boolean;
}

export interface AutocompleteDropdownButton {
  /**
   * The text that appears on the button
   */
  label?: string;
  /**
   * The class for button style
   */
  class?: string;
  /**
   * An option icon that will appear on the button
   */
  icon?: AutocompleteDropdownButtonIcon;
}

export interface AutocompleteDropdownButtonIcon {
  /**
   * String for icon clas (font-awesome, glphicon, etc)
   */
  class: string;
  /**
   * String for alt icon text for screen readers
   */
  altText: string;
}

export interface HistoryNodeType {
  /**
   * Identifier for node
   */
  id: string;
  /**
   * Date value for node
   */
  date: string;
  /**
   * Optional url value for title
   */
  url?: string;
  /**
   * Title value for node
   */
  title: string; 
  /**
   * Optional description for node
   */
  description?: string;
  /**
   * Optional tagged value for node
   */
  isTagged?: boolean;
}

// Autocomplete Config Interfaces

export interface AutocompleteConfig {
  /**
   * Optional name attribute
   */
  name?: string;
  /**
   * Optional id attribute
   */
  id?: string;
  /**
   * Optional label text
   */
  labelText?: string;
  /**
   * Adds a clear button in the input
   */
  showClearButton?: boolean;
  /**
   * Adds an icon inside the input
   */
  addOnIconClass?: string;
  /**
   * Allows any text inside the input to register as a selection
   */
  allowAny?: boolean;
  /**
   * Defines the key/value configuration
   */
  keyValueConfig?: AutocompleteKeyValueConfig;
  /**
   * Adds optional placeholder text
   */
  placeholder?: string;
  /**
   * Passes value to the custom autocomplete service fetch method call 
   */
  serviceOptions?: any;
  /**
   * Sets a hard limit on number of items to render at a time
   */
  dropdownLimit?: number;
  /**
   * Clears input on selection
   */
  clearOnSelection?: boolean;
  /**
   * When input is empty, dropdown is still displayed on focus
   */
  showOnEmptyInput?: boolean;
}

export interface AutocompleteKeyValueConfig {
  /**
   * The lookup value for the option
   */
  keyProperty: string;
  /**
   * The human-readable value of the option
   */
  valueProperty: string;
}
//Download
export interface DownloadPackageType {
  /**
   * Sets a package id value 
   */
  packageId: string;
  /**
   * Sets the package name
   */
  name: string;
  /**
   * Sets the package type
   */
  type: string;
  /**
   * Sets the packages access property
   */
  access: "Public"|"Private";
  /**
   * Sets the posted date property
   */
  postedDate: string;
  /**
   * Sets the resources in the package
   */
  resources: DownloadResourceType[];
  /**
   * Sets the initial state of package accordion
   */
  accordionState: "collapsed"|"expanded";
  /**
   * Sets the download url for the whole package
   */
  downloadUrl: string;
}
export interface DownloadResourceType {
  /**
   * Sets a resource id value
   */
  resourceId: string;
  /**
   * Sets the resource name
   */
  name: string;
  /**
   * Sets the resource description
   */
  description: string;
  /**
   * Sets the resource filesize
   */
  size: string;
  /**
   * Sets the resource download url
   */
  downloadUrl: string;
  /**
   * Sets the resource type information
   */
  typeInfo: DownloadResourceTypeInfoType;
}
export interface DownloadResourceTypeInfoType{
  /**
   * Sets the resource type name
   */
  name: string;
  /**
   * Sets the font awesome icon to use for the resource
   */
  iconClass: string;
}


export interface ListDisplayConfig {
  /**
   * Toggles a new item indicator feature
   */
  showNewIndicator?: boolean;
  /**
   * Sets the new item indicator config
   */
  newItemIndicator?: NewItemIndicator;
  /**
   * Defines the key/value configuration
   */
  keyValueConfig?: AutocompleteKeyValueConfig;
}

export interface NewItemIndicator {
  /**
   * HTML class passed added onto the new item
   */
  class?: string;
  /**
   * Label value for the new item
   */
  label?: string;
}

export interface PointOfContactType{
  /**
   * Sets the full name property
   */
  fullName?: string;
  /**
   * Sets the title property
   */
  title?: string;
  /**
   * Sets the primary address property
   */
  address?: string;
  /**
   * Sets the secondary address property
   */
  address2?: string;
  /**
   * Sets the city name property
   */
  city?: string;
  /**
   * Sets the state property
   */
  state?: string;
  /**
   * Sets the zip code property
   */
  zip?: string;
  /**
   * Sets the email property
   */
  email?: string;
  /**
   * Sets the primary phone property
   */
  phone?: string;
  /**
   * Sets the secondary phone property
   */
  phone2?: string;
  /**
   * Sets the fax number property
   */
  fax?: string;
  /**
   * Sets the website url
   */
  website?: string;
}
