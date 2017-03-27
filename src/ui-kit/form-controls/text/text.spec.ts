import { TestBed } from '@angular/core/testing';
import { SamTextComponent } from './text.component';
import { LabelWrapper } from "../../wrappers/label-wrapper";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";

describe('The Sam Text component', () => {
  let component: SamTextComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        SamTextComponent,
        LabelWrapper,
      ],
    });

    fixture = TestBed.createComponent(SamTextComponent);
    component = fixture.componentInstance;
    component.label = 'A label can have spaces';
    component.name = 'my-text-component';
  });

  it('should allow an initial value to be set by the value input', () => {
    component.value = "ABC123";
    fixture.detectChanges();
    let input = fixture.debugElement.query(By.css('#my-text-component'));
    expect(input.nativeElement.value).toBe("ABC123");
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
