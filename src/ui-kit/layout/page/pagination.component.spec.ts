import { TestBed, waitForAsync, ComponentFixture } from "@angular/core/testing";

import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import {} from "../../";
import {
  SamPageComponent,
  SamPageSidebarComponent,
  SamPageService,
} from "./page.component";
import { SamExperimentalModule } from "../../../ui-kit/experimental/experimental.module";

describe("SamPageComponent", () => {
  let component: SamPageComponent;
  let fixture: ComponentFixture<SamPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SamPageComponent],
      imports: [FormsModule, SamExperimentalModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("intro", () => {
    component.intro = "test into";

    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css(".intro"));
    expect(el.nativeElement.innerHTML).toContain("test into");
  });
});

describe("SamPageSidebarComponent", () => {
  it("marks the page service's sidebar flag true on init", () => {
    const pageService = new SamPageService();
    const sidebarComponent = new SamPageSidebarComponent(pageService);

    sidebarComponent.ngOnInit();

    expect(pageService.sidebar).toBe(true);
  });
});
