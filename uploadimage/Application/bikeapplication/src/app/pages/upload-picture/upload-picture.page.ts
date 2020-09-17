import { Component, OnInit } from '@angular/core';
import { Plugins, CameraSource,CameraResultType } from '@capacitor/core';
const { Camera } = Plugins;

@Component({
  selector: 'app-upload-picture',
  templateUrl: './upload-picture.page.html',
  styleUrls: ['./upload-picture.page.scss'],
})
export class UploadPicturePage implements OnInit {

  constructor() { }

  async chooseOrTakePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      //source: CameraSource.Camera
    }).catch((error)=>{
      console.log(error)
    })
    // variable image should contain our base64 image
  }

  ngOnInit() {
  }

}
