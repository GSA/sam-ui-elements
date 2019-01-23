import { SamHierarchicalTreeGridConfiguration } from './SamHierarchicalTreeGridConfiguration';
import { SamHierarchicalTreeHeaderConfiguration } from './SamHierarchicalTreeHeaderConfiguration';
import { SamHierarchicalTreeGridColumn } from './SamHierarchicalTreeGridColumn';

export class SamHierarchicalTreeConfiguration implements SamHierarchicalTreeGridConfiguration, SamHierarchicalTreeHeaderConfiguration {

    /**
     * 
     */
    public filterPlaceholderText: String;

    /**
     * 
     */
    public gridDisplayedColumn: SamHierarchicalTreeGridColumn[]

    /**
     * 
     */
    public primaryKey: string;

    /**
    * 
    */
    public childCountField: string;

    /**
    *  Property from supplied model used for the top part of the basic template
    */
    public valueProperty: string;

    /**
     *  Top Level Breadcrumb Text 
     */
    public topLevelBreadcrumbText: string;

}