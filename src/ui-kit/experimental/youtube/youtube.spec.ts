import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SamYoutubeComponent } from "./youtube.component";

describe("The Sam Youtube component", () => {
  let component: SamYoutubeComponent;
  let fixture: ComponentFixture<SamYoutubeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamYoutubeComponent],
    });
    fixture = TestBed.createComponent(SamYoutubeComponent);
    component = fixture.componentInstance;
  });

  it("should build the embed url from the id input on init", () => {
    component.id = "dQw4w9WgXcQ";
    fixture.detectChanges();
    expect(component.YouTubeVideoUrl).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    );
  });

  it("should render an iframe pointed at the sanitized video url", () => {
    component.id = "dQw4w9WgXcQ";
    fixture.detectChanges();
    const iframe = fixture.nativeElement.querySelector("iframe");
    expect(iframe.getAttribute("src")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    );
  });

  it("should update the video url when updateVideoUrl is called directly", () => {
    fixture.detectChanges();
    component.updateVideoUrl("anotherId");
    expect(component.YouTubeVideoUrl).toBe(
      "https://www.youtube.com/embed/anotherId"
    );
  });
});
