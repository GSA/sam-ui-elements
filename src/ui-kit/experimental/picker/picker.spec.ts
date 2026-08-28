import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SamPickerComponent } from "./picker";
import { SamPopoverComponent } from "./popover";

@Component({
  template: `
    <sam-picker>
      <input #input type="text" />
      <sam-popover>
        <div role="grid">
          <div role="row">
            <div role="gridcell" data-value="a">A</div>
            <div role="gridcell" data-value="b">B</div>
          </div>
        </div>
      </sam-popover>
    </sam-picker>
  `,
  standalone: false,
})
class HostComponent {}

describe("The Sam Picker component", () => {
  let fixture: ComponentFixture<HostComponent>;
  let picker: SamPickerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, SamPickerComponent, SamPopoverComponent],
    });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    picker = fixture.debugElement.children[0].componentInstance;
  });

  it("should wire up a combobox once the input and popover are available", () => {
    expect(picker.combobox).toBeTruthy();
  });

  it("should emit onSearch when the input dispatches an input event", () => {
    const emitted: string[] = [];
    picker.onSearch.subscribe((value) => emitted.push(value));
    const input: HTMLInputElement = picker.input.nativeElement;
    input.value = "a";
    input.dispatchEvent(new Event("input"));
    expect(emitted.length).toBe(1);
  });

  it("should emit onChange and update selected when a grid cell is clicked", () => {
    const emitted: any[] = [];
    picker.onChange.subscribe((cell) => emitted.push(cell));
    const cellEl: HTMLElement =
      fixture.nativeElement.querySelector('[data-value="a"]');
    cellEl.click();
    expect(emitted.length).toBe(1);
    expect(picker.selected).toBe(emitted[0]);
  });

  it("should clear the input value when clearInput is called", () => {
    const input: HTMLInputElement = picker.input.nativeElement;
    input.value = "something";
    picker.clearInput();
    expect(input.value).toBe("");
  });
});

describe("The Sam Picker component without an input/popover", () => {
  @Component({
    template: `<sam-picker></sam-picker>`,
    standalone: false,
  })
  class EmptyHostComponent {}

  it("should not construct a combobox when input/popover are absent", () => {
    TestBed.configureTestingModule({
      declarations: [EmptyHostComponent, SamPickerComponent],
    });
    const fixture = TestBed.createComponent(EmptyHostComponent);
    fixture.detectChanges();
    const picker: SamPickerComponent =
      fixture.debugElement.children[0].componentInstance;
    expect(picker.combobox).toBeUndefined();
  });
});
