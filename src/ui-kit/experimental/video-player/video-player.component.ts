import { Component, Input, OnInit, ContentChildren, QueryList, ElementRef, forwardRef, Renderer2} from '@angular/core';
import GLOBAL_STRINGS from 'accessible-html5-video-player/js/strings.js'
import * as InitPxVideo from 'accessible-html5-video-player/js/px-video.js';
declare var InitPxVideo: any;

// NOTE: Add px-video.js and strings.js files to your application .angular-cli.json script tag

interface InitPxVideoConfig {
  "videoId": string,
  "captionsOnDefault": boolean,
  "seekInterval": number,
  "videoTitle": string,
  "debug": boolean
}

@Component({
  selector: 'sam-video-player',
  templateUrl: './video-player.template.html'
})

export class SamVideoPlayerComponent {
  @ContentChildren('videoPly', {descendants: true}) public videos: QueryList<ElementRef>;
  @ContentChildren('videoTrack', {descendants: true}) public tracks: QueryList<ElementRef>;
  @ContentChildren('videoSrc', {descendants: true}) public sources: QueryList<ElementRef>;

  @Input() public videoId: string;
  @Input() public title: string;
  @Input() public captionOption: boolean;
  @Input() public seekInterval: number;
  private config: InitPxVideoConfig;

  constructor(private render: Renderer2, private template:ElementRef) {}

  ngAfterContentInit() {
    if (this.videos.length === 0) {
      console.warn('SamVideoComponent must be provide a <video> element to function or provide template variable #videoPly');
    }

    if (this.sources.length === 0) {
      console.warn('SamVideoComponent must be provide a <source> element to function or provide template variable #videoSrc');
    }

    if (this.tracks.length === 0) {
      console.warn('SamVideoComponent must be provide a <track> element with captions for 508 compliance or provide template variable #videoTrack');
    }
  }

  ngAfterViewInit() {
    this.config = {
      "videoId": this.videoId,
      "captionsOnDefault": this.captionOption,
      "seekInterval": this.seekInterval ? this.seekInterval : 10,
      "videoTitle": this.title ? this.title : 'Sam Video',
      "debug": true
    }

    // Initialize video player
    new InitPxVideo(this.config);

    const progressEl = this.template.nativeElement.querySelector('progress');
    const videoEl = this.template.nativeElement.querySelector('video');
    this.render.setAttribute(progressEl, 'name', this.videoId);
    this.render.setAttribute(progressEl, 'aria-label', 'video progress bar');
    this.render.setAttribute(progressEl, 'role', 'progressbar');
    this.render.setAttribute(videoEl, 'name', this.videoId);
    this.render.setAttribute(videoEl, 'role', 'presentation');
  }

  ngOnDestroy() {
    let pxAnounce = document.getElementById('px-video-aria-announce');
    if (pxAnounce) pxAnounce.remove();
  }
}
