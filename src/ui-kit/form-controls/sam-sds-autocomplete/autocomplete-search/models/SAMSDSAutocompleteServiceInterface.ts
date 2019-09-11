import { Observable } from 'rxjs';
export interface SAMSDSAutocompleteServiceInterface {
    /**
     * 
     * @param searchValue 
     */
    getDataByText(currentItems: number, searchValue?: string): Observable<SAMSDSHiercarchicalServiceResult>;
}

export interface SAMSDSHiercarchicalServiceResult {
    /**
     * 
     */
    items: object[];

    /**
     * 
     */
    totalItems: number;
}

export class SDSHiercarchicalServiceSearchItem {

    /**
     * 
     */
    id: string;

    /**
     * 
     */
    searchValue: string;

    /**
     * 
     */
    // sort: Sort;

    /**
     * 
     */
    currentItemCount: number;
}

