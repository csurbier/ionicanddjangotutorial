import { Component, NgZone } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
const { Filesystem } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  pictures=[]
  constructor(private mediaCapture: MediaCapture) { 

  }

  openCamera(){
    let options: CaptureImageOptions = { limit: 1 }
    this.mediaCapture.captureImage(options).then(async (data: MediaFile[]) => {
      console.log(JSON.stringify(data))
      for (let photo of data){
        let fullPath = photo.fullPath
        try{
          let photoBinary = await Filesystem.readFile({path:fullPath})
          if (photoBinary.data){
            let fullData = "data:" + photo.type + ";base64," + photoBinary.data
            this.pictures.push(fullData)
          }
        
        }
        catch(error){
          console.log(error)
        }
       
      }
    },
    (err: CaptureError) => {
      console.error(err)
    });
  }

}
