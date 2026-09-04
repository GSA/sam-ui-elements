import { TestBed, waitForAsync } from "@angular/core/testing";
import { DatepickerGalleryComponent } from "./datepicker-gallery.component";

describe("DatepickerGalleryComponent", () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DatepickerGalleryComponent],
    }).compileComponents();
  }));

  it("should create", () => {
    const fixture = TestBed.createComponent(DatepickerGalleryComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
