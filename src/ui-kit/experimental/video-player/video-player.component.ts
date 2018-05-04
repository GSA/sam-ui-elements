import { Component, Input, OnInit} from '@angular/core';
import GLOBAL_STRINGS from 'accessible-html5-video-player/js/strings.js'
import InitPxVideo from 'accessible-html5-video-player/js/px-video.js';
declare var InitPxVideo: any;

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

export class SamVideoPlayerComponent implements OnInit {

  @Input() width: string;
  @Input() height: string;
  @Input() poster: string;
  @Input() srcUrl: string;
  @Input() public config: InitPxVideoConfig;
  
  constructor(){}

  ngOnInit(){
    
  }
  ngAfterContentInit() {
    console.log('test==='+InitPxVideo)
    // Initialize
    new InitPxVideo({
      "videoId": "myvid",
      "captionsOnDefault": true,
      "seekInterval": 20,
      "videoTitle": "clips",
      "debug": true
    });
  }
}