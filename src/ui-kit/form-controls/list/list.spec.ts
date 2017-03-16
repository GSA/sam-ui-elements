import { TestBed } from '@angular/core/testing';
import { SamListComponent } from './list.component';
import { SamAutocompleteModule } from '../autocomplete';
import { LabelWrapper } from "../../wrappers/label-wrapper";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";

describe('The Sam List component', () => {
  let component: SamListComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        SamAutocompleteModule
      ],
      declarations: [
        SamListComponent,
        LabelWrapper,
      ],
    });

    fixture = TestBed.createComponent(SamListComponent);
    component = fixture.componentInstance;
    component.options = [{
      label: 'apple',
      value: 1,
      name: 'apple'
    },{
      label: 'orange',
      value: 2,
      name: 'orange'
    },{
      label: 'banana',
      value: 3,
      name: 'banana'
    },{
      label: 'grape',
      value: 4,
      name: 'grape'
    }];
    fixture.detectChanges();
  });
  it('should compile', () => {
    expect(true).toBe(true);
  });
  it('should update selections', () => {
    component.selections = ["apple"];
    fixture.detectChanges();
    let input = fixture.debugElement.query(By.css('.usa-unstyled-list'));
    //console.log(input.nativeElement);
    expect(input.nativeElement.innerHTML).toContain("apple");
  });
});
