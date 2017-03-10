import { TestBed } from '@angular/core/testing';
import { SamNumberComponent } from './number.component';
import { LabelWrapper } from '../../wrappers/label-wrapper/label-wrapper.component';
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";

describe('The Sam Number component', () => {
  let component: SamNumberComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        SamNumberComponent,
        LabelWrapper,
      ],
    });

    fixture = TestBed.createComponent(SamNumberComponent);
    component = fixture.componentInstance;
    component.label = 'A label can have spaces';
    component.name = 'my-num-component';
  });

  it('should allow an initial value to be set by the value input', () => {
    component.value = 123;
    fixture.detectChanges();
    let input = fixture.debugElement.query(By.css('#my-num-component'));
    expect(input.nativeElement.value).toBe('123');
  });

  it('should show a hint message', () => {
    let hint = "Life pro tip: eat vegetables";
    component.hint = hint;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(hint);
  });

  it('should show an error message', () => {
    let errorMessage = "Uh-oh, something went wrong";
    component.errorMessage = errorMessage;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
  });

  it('should show a label', () => {
    let labelText = "Pick from the following options";
    component.label = labelText;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(labelText);
  });
});
