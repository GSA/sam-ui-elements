import { Observable } from 'rxjs';
import { Sort } from '../../components/data-table/sort.directive';

export interface SamHiercarchicalServiceInterface {

    /**
     * 
     * @param searchValue 
     */
    getDataByText(currentItems: number, searchValue?: string): Observable<SearchByTextResult>;


    /**
     * 
     * @param id 
     */
    getHiercarchicalById(id: string, searchValue: string, sort: Sort): Observable<object[]>;

}

export interface SearchByTextResult {
    items: object[];
    totalItems: number;
}