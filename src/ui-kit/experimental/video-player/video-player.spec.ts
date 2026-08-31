import { Component, ViewChild } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { SamVideoPlayerComponent } from "./video-player.component";

@Component({
  template: `
    <sam-video-player [videoId]="videoId" [title]="title">
      <video #videoPly>
        <source #videoSrc src="test.mp4" type="video/mp4" />
        <track #videoTrack kind="captions" />
      </video>
      <progress></progress>
    </sam-video-player>
  `,
  standalone: false,
})
class HostComponent {
  videoId = "vid1";
  title = "Test Video";

  @ViewChild(SamVideoPlayerComponent) player: SamVideoPlayerComponent;
}

@Component({
  template: `
    <sam-video-player [videoId]="videoId">
      <progress></progress>
      <video></video>
    </sam-video-player>
  `,
  standalone: false,
})
class EmptyHostComponent {
  videoId = "vid2";

  @ViewChild(SamVideoPlayerComponent) player: SamVideoPlayerComponent;
}

describe("The Sam Video Player component", () => {
  let initPxVideoSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    initPxVideoSpy = vi.fn();
    (
      globalThis as unknown as { InitPxVideo: typeof initPxVideoSpy }
    ).InitPxVideo = initPxVideoSpy;
  });

  afterEach(() => {
    delete (globalThis as unknown as { InitPxVideo?: unknown }).InitPxVideo;
  });

  it("should initialize the player and set attributes on the progress/video elements", () => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, SamVideoPlayerComponent],
    });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(initPxVideoSpy).toHaveBeenCalledWith(
      expect.objectContaining({ videoId: "vid1", videoTitle: "Test Video" })
    );

    const videoEl = fixture.nativeElement.querySelector("video");
    expect(videoEl.getAttribute("name")).toBe("vid1");
    expect(videoEl.getAttribute("role")).toBe("presentation");
  });

  it("should default the video title and seek interval when not provided", () => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, SamVideoPlayerComponent],
    });
    const fixture = TestBed.createComponent(HostComponent);
    const host = fixture.componentInstance;
    host.title = "";
    fixture.detectChanges();

    expect(initPxVideoSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        videoTitle: "Sam Video",
        seekInterval: 10,
      })
    );
  });

  it("should emit onFullScreenChange when the document fullscreenchange event fires", () => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, SamVideoPlayerComponent],
    });
    const fixture = TestBed.createComponent(HostComponent);
    const host = fixture.componentInstance;
    fixture.detectChanges();

    const emitted: boolean[] = [];
    host.player.onFullScreenChange.subscribe((val: boolean) =>
      emitted.push(val)
    );
    host.player.onToggleFullScreen({} as Event);

    expect(emitted.length).toBe(1);
  });

  it("should log errors for each missing required content child on init", () => {
    TestBed.configureTestingModule({
      declarations: [EmptyHostComponent, SamVideoPlayerComponent],
    });
    const fixture = TestBed.createComponent(EmptyHostComponent);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    fixture.detectChanges();

    expect(errorSpy).toHaveBeenCalledTimes(3);
    errorSpy.mockRestore();
  });

  it("should remove the aria-announce element on destroy when it exists", () => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, SamVideoPlayerComponent],
    });
    const fixture = TestBed.createComponent(HostComponent);
    const host = fixture.componentInstance;
    fixture.detectChanges();

    const announceEl = document.createElement("div");
    announceEl.id = "px-video-aria-announce";
    document.body.appendChild(announceEl);

    host.player.ngOnDestroy();

    expect(document.getElementById("px-video-aria-announce")).toBeNull();
  });
});
