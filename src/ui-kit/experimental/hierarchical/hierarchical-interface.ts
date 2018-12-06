import { Observable } from 'rxjs';


export interface SamHiercarchicalServiceInterface {

    /**
     * 
     * @param searchValue 
     */
    getDataByText(currentItems:number, searchValue?: string): Observable<SearchByTextResult>;


    /**
     * 
     * @param id 
     */
    getHiercarchicalById(id?: string): Observable<object[]>;





}

export interface SearchByTextResult {
    items: object[];
    totalItems: number;
}