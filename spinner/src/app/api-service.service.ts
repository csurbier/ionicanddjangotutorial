import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  isShowingLoader = false;
  loader: any;
  loadingObserver: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loadingRequestMap: Map<string, boolean> = new Map<string, boolean>();

  constructor(public http: HttpClient,
    public loadingController: LoadingController,
    public alertCtrl: AlertController,
    public platform: Platform) {
  }

  setLoading(loading: boolean, url: string): void {
    if (!url) {
      throw new Error('The request URL must be provided');
    }
    if (loading === true) {
      this.loadingRequestMap.set(url, loading);
      this.loadingObserver.next(true);
    }else if (loading === false && this.loadingRequestMap.has(url)) {
      this.loadingRequestMap.delete(url);
    }
    if (this.loadingRequestMap.size === 0) {
      this.loadingObserver.next(false);
    }
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
