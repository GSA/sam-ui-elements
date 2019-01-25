import { SamHierarchicalTreeGridColumn } from './SamHierarchicalTreeGridColumn';
export class SamHierarchicalTreeGridConfiguration {

    /**
     *  This is the primary field used to identify each object in the results
     */
    public primaryKeyField: string;

    /**
     * Column definitions to be displayed
     */
    public gridColumnsDisplayed: SamHierarchicalTreeGridColumn[]

    /**
    *  Field for model that determines number of child elements
    */
    public childCountField: string;
}
