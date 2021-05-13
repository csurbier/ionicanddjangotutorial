import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AlertController ,LoadingController} from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class ApiDjangoService {

  loader:any;
  tokenSSO: String = "";
  expireDate: any;
  networkConnected: boolean = true;
  virtualHostName: string = "https://app-b86ed9a3-cfa5-4d79-a572-890b5a4e545f.cleverapps.io/"
  oAuth2ClientId: string = 'VbXH6Jwp7FSMqgL9fuXn3Qo6dI57BEYH1FGEMQPF';
  oAuth2ClientSecret: string = 'Vur9PaOf39LaWEWxIAitTUrvbQOCDegCUpwCPCmKqcbZDz5FhbTKfYeI0IUBFvY4g3hxf4CctEWzw2KJrOfEsAVTDQ2z4LPImoRoGxyzZMmulswIwNLJHRIK8JIfTD93';
  oAuth2Username: string = 'csurbier@idevotion.fr'; // Set your oAuth2 username
  oAuth2Password: string = 'eclipse'; // Set your oAuth2 password
  appName: string = 'bikeapplication';
  apiPrefix = "/api"
  getOauthUrl = this.virtualHostName + "/o/token/";
  getUserUrl = this.virtualHostName + this.apiPrefix + "/users/"
  urlPwdOublie = this.virtualHostName + "/account/reset_password";
  getPaymentIntentUrl = this.virtualHostName + this.apiPrefix +  "/createpaymentintent/";
  getBikesAroundUrl = this.virtualHostName + this.apiPrefix +  "/bikes/";
  getUploadPhotoUrlBinary= this.virtualHostName + this.apiPrefix + "/uploadphotobinary/"
  constructor(public http: HttpClient,
    public loadingController: LoadingController,
    public alertCtrl: AlertController,
    public storage: Storage) {

  }


 

  sendSmsCode(phone) {


    const options = {
        headers: new HttpHeaders({
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + this.tokenSSO
        })
    };

    let  queryPath;
 
    queryPath = this.getSmsCodeUrl + "?phone=" + phone;
 
    return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        this.http.get(queryPath, options)
            .pipe(retry(1))
            .subscribe(res => {
                observer.next(res);
                observer.complete();
            }, error => {
                observer.next();
                observer.complete();
                console.log(error);// Error getting the data
            });
    });
}


  async showLoading() {
     
    this.loader = await this.loadingController.create({
      message:  'Please wait',
      duration: 4000
    });
    return await this.loader.present();
   
  }

   public async showLoadingMessage(message) {
    this.loader = await this.loadingController.create({
      message: message,
    });
    this.loader.present();
  }



  async stopLoading() {
    console.log("On stop loading")
    if (this.loader){
      this.loader.dismiss()
    }
    else{
      console.log("Pas de loader")
    }
   
  }

  async showNoNetwork() {
    let alert = await this.alertCtrl.create({
      header: 'Sorry',
      message: 'No network detected. Please check your internet connexion',
      buttons: ['OK']
    });
   
    return await alert.present();
    
  }

  async showError(text) {
    let alert = await this.alertCtrl.create({
      header: 'Error',
      message: text,
      buttons: ['OK']
    });
    return await alert.present();
  }

  async showMessage(title, message) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    return await alert.present();
  }

}
