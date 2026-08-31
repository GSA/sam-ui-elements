import { TestBed, waitForAsync } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SamTabsNextModule } from "@gsa-sam/sam-ui-elements/src/ui-kit/experimental/tabs";
import { TabsGalleryComponent } from "./tabs-gallery.component";

describe("TabsGalleryComponent", () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SamTabsNextModule],
      declarations: [TabsGalleryComponent],
    }).compileComponents();
  }));

  it("should create", () => {
    const fixture = TestBed.createComponent(TabsGalleryComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
