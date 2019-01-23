import { SamHierarchicalAutocompleteConfiguration } from './SamHierarchicalAutocompleteConfiguration';
import { SelectedResultConfiguration } from './SamHierarchicalSelectedResultConfiguration';
import { SamHierarchicalTreeConfiguration } from './SamHierarchicalTreeConfiguration';
import { SamHierarchicalTreeGridColumn } from './SamHierarchicalTreeGridColumn';


export class SamHierarchicalConfiguration implements SamHierarchicalAutocompleteConfiguration, SelectedResultConfiguration, SamHierarchicalTreeConfiguration {



    /**
      * sets the default debounce time to 250 milliseconds 
      */
    constructor() {
        this.debounceTime = 250;
        this.modalCancelButtonLabel = "Cancel";
        this.modalSelectButtonLabel = "Select";
    }

    /**
     * Used to describe the drop down (Text should match the label that will be supplied)
     */
    public labelText: string;

    /**
     * Used for the Id of the control
     */
    public id: string;

    /**
     *  This is the primary field used to identify each object in the results
     */
    public primaryKeyField: string;

    /**
     *  Property from supplied model used for the top part of the basic template
     */
    public primaryTextField: string;

    /**
     *  Property from supplied model used for the bottom part of the basic template
     */
    public secondaryTextField: string;

    /**
     *  Sets the time waited for addional key actions Default is 250 milliseconds
     */
    public debounceTime: number;

    /**
     * Place holder text for input
     */
    public placeHolderText: string;

    /**
     * 
     */
    public modalTitle: string;

    /**
     * 
     */
    public modalSelectButtonLabel: string;

    /**
     * 
     */
    public modalCancelButtonLabel: string;

    /**
     * 
     */
    public gridDisplayedColumn: SamHierarchicalTreeGridColumn[]

    /**
    * 
    */
    public childCountField: string;

    /**
     * 
     */
    public filterPlaceholderText: String;


    /**
     * Top Level Breadcrumb Text 
     */
    public topLevelBreadcrumbText: string;

}
