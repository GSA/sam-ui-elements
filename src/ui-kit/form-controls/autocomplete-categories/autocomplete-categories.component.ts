import { Component, Input, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: "sam-autocomplete-categories",
  templateUrl: "autocomplete-categories.template.html"
})
export class SamAutocompleteCategoriesComponent {
  @Input() options: Array<any> = [];
  @Input() valueProperty: string;
  @Input() categoryKey: string;
  @Input() categories: Array<any> = [];
  @Input() isCategorySelectable: boolean = false;

  input: string = "";

  constructor() {}

  filterOptions(input: string): Array<any> {
    /**
     * Returns an array of objects which have
     * valueProperties that include the input
     * string when both are lowercased.
     */
    return this.options.filter((item) => {
      if (item[this.valueProperty].toLowerCase().includes(input.toLowerCase())) {
        return item;
      }
    });
  }

  isCategory(option: any): boolean {
    return this.categories.indexOf(option[this.categoryKey]) === -1 ? false : true;
  }

  checkForResults(array: Array<any>): Array<any> {
    /**
     * Checks if array has children and returns 
     * children if true. If not, returns an
     * array with one object which has a 
     * 'valueProperty' that evaluates to 
     * 'No results.'
     * 
     * The purpose of this method is to handle 
     * the case of having no results in the 
     * array without adding logic to the view.
     */
    const returnObject = {};
    returnObject[this.valueProperty] = "No results";
    return array.length > 0 ? array : [returnObject];
  }


  selectOption(option: any): void {
    if (!this.isCategorySelectable && this.isCategory(option)) {
      return undefined;
    }
    console.log(option);
    return option;
  }

}