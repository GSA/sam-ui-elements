import { Component, Input, OnInit, AfterViewInit} from '@angular/core';
// import * as InitPxVideo from 'accessible-html5-video-player';

@Component({
  selector: 'sam-video-player',
  templateUrl: './video-player.template.html'
})

export class SamVideoPlayerComponent implements OnInit {

  @Input() width: string;
  @Input() height: string;
  @Input() poster: string;
  @Input() srcUrl: string;
  @Input() enCaption: string;
  @Input() spCaption: string;

  constructor(){}

  ngOnInit(){
    // Initialize
      // new InitPxVideo({
      //   "videoId": "myvid",
      //   "captionsOnDefault": true,
      //   "seekInterval": 20,
      //   "videoTitle": "clips",
      //   "debug": true
      // });
  }
}