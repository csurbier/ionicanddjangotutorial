import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  isShowingLoader = false;
  loader: any;
  constructor(public http: HttpClient,
    public loadingController: LoadingController,
    public alertCtrl: AlertController,
    public platform: Platform) {
  }

  getJsonData() {
    let urlToCall = "https://jsonplaceholder.typicode.com/comments/"
    return Observable.create(observer => {
      this.http.get(urlToCall)
        .subscribe(res => {
          observer.next(res);
          observer.complete();
        }, error => {
          observer.next(null);
          observer.complete();
        });
    });
  }


  async showLoader() {
    if (!this.isShowingLoader) {
      this.isShowingLoader = true
      this.loader = await this.loadingController.create({
        message: 'Please wait',
        duration: 4000
      });
      return await this.loader.present();
    }

  }



  async stopLoader() {
    if (this.loader) {
      this.loader.dismiss()
      this.loader = null
      this.isShowingLoader = false
    }

  }
}
