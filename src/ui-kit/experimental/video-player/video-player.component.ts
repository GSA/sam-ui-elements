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
      console.error('SamVideoComponent must be provide a <video> element to function or provide template variable #videoPly');
    }

    if (this.sources.length === 0) {
      console.error('SamVideoComponent must be provide a <source> element to functionor or provide template variable #videoTrack');
    }

    if (this.tracks.length === 0) {
      console.error('SamVideoComponent must be provide a <track> element with captions for 508 complianceor or provide template variable #videoSrc');
    }
  }

  ngAfterViewInit() {
    this.config = {
      "videoId": this.videoId,
      "captionsOnDefault": this.captionOption ? this.captionOption : true,
      "seekInterval": this.seekInterval ? this.seekInterval : 10,
      "videoTitle": this.title ? this.title : 'Sam Video',
      "debug": true
    }

    // Initialize video player
    new InitPxVideo(this.config);

    const el = this.template.nativeElement.querySelector('progress');
    this.render.setAttribute(el, 'name', this.videoId);
  }
}
