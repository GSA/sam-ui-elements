import { Observable } from 'rxjs';


export interface SamHiercarchicalServiceInterface {


    /**
     * 
     * @param searchValue 
     */
    getDataByText(searchValue?: string): Observable<object[]>;


    /**
     * 
     * @param id 
     */
    getHiercarchicalById(id?: string): Observable<object[]>;





}