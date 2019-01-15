import { SamHierarchicalTreeGridConfiguration } from './SamHierarchicalTreeGridConfiguration';
import { SamHierarchicalTreeHeaderConfiguration } from './SamHierarchicalTreeHeaderConfiguration';
import { SamHierarchicalTreeGridColumn } from './SamHierarchicalTreeGridColumn';

export class SamHierarchicalTreeConfiguration implements SamHierarchicalTreeGridConfiguration, SamHierarchicalTreeHeaderConfiguration {


    /**
     * 
     */
    gridDisplayedColumn: SamHierarchicalTreeGridColumn[]

    /**
     * 
     */
    primaryKey: string;

}
