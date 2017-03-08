import { TestBed } from '@angular/core/testing';
import { SamListComponent } from './list.component';
import { LabelWrapper } from "../../wrappers/label-wrapper";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";

fdescribe('The Sam List component', () => {
  let component: SamListComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        SamListComponent,
        LabelWrapper,
      ],
    });

    fixture = TestBed.createComponent(SamListComponent);
    component = fixture.componentInstance;
    component.options = ['apple','orange','banana','grape'];
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
