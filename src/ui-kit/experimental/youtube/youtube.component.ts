import { Component, Input, OnInit, inject } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "sam-youtube",
  template: `
    <div class="sam embed video ratio16by9">
      <iframe
        [src]="videoUrl"
        allow="autoplay; encrypted-media"
        allowfullscreen
      >
      </iframe>
    </div>
  `,
  standalone: false,
})
export class SamYoutubeComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);

  /**
   * YouTube video id
   */
  @Input() public id: string;

  YouTubeVideoUrl: string;
  videoUrl: SafeResourceUrl;

  ngOnInit() {
    this.updateVideoUrl(this.id);
  }

  updateVideoUrl(id: string) {
    this.YouTubeVideoUrl = "https://www.youtube.com/embed/" + id;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.YouTubeVideoUrl
    );
  }
}
