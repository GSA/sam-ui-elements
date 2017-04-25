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
   * identifier for node
   */
  id: string;
  /**
   * date value for node
   */
  date: string;
  /**
   * optional url value for title
   */
  url?: string;
  /**
   * title value for node
   */
  title: string; 
  /**
   * optional description for node
   */
  description?: string;
  /**
   * optional tagged value for node
   */
  isTagged?: boolean;
}

// Autocomplete Config Interfaces

export interface AutocompleteConfig {
  /**
   * optional name attri
   */
  name?: string;
  id?: string;
  labelText?: string;
  showClearButton?: boolean;
  addOnIconClass?: string;
  allowAny?: boolean;
  keyValueConfig?: AutocompleteKeyValueConfig;
  placeholder?: string;
  serviceOptions?: any;
  dropdownLimit?: number;
  clearOnSelection?: boolean;
  showOnEmptyInput?: boolean;
}

export interface AutocompleteKeyValueConfig {
  keyProperty: string;
  valueProperty: string;
}
//Download
export interface DownloadPackageType {
  packageId: string;
  name: string;
  type: string;
  access: "Public"|"Private";
  postedDate: string;
  resources: DownloadResourceType[];
  accordionState: "collapsed"|"expanded";
  downloadUrl: string;
}
export interface DownloadResourceType {
  resourceId: string;
  name: string;
  description: string;
  size: string;
  downloadUrl: string;
  typeInfo: DownloadResourceTypeInfoType;
}
export interface DownloadResourceTypeInfoType{
  name: string;
  iconClass: string;
}


export interface ListDisplayConfig {
  showNewIndicator?: boolean;
  newItemIndicator?: NewItemIndicator;
  keyValueConfig?: AutocompleteKeyValueConfig;
}

export interface NewItemIndicator {
  class?: string;
  label?: string;
}

//POC - all fields optional
export interface PointOfContactType{
  fullName?: string;
  title?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  email?: string;
  phone?: string;
  phone2?: string;
  fax?: string;
  website?: string;
}
