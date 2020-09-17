import { Component, ViewChild } from '@angular/core';
import { VgApiService, VgMediaDirective } from '@videogular/ngx-videogular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(VgMediaDirective, { static: true }) media: VgMediaDirective;
  api:VgApiService;
  urlVideo:string=""
  items = [
    {
      "title":"External file",
      "url":"http://static.videogular.com/assets/videos/videogular.mp4",
      "imagePreview":"assets/earth.png"
    },
    {
      "title":"Local video file",
      "url":"assets/videogular.mp4",
      "imagePreview":"assets/earth.png"
    },
  ]
  constructor() {}

  playVideo(item){
   
    // Play video
    this.urlVideo=item.url
    if (this.media){
       this.media.vgMedia.src=this.urlVideo
       this.media.subscriptions.canPlay.subscribe((value)=>{
        //this.api.fsAPI.toggleFullscreen()
        this.media.play()
       })
    }
  }

  onPlayerReady(api:VgApiService){
    this.api = api
    this.urlVideo = this.items[0].url
   // this.api.fsAPI.toggleFullscreen()
  }
}
