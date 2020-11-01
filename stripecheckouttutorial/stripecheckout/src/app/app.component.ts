import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Plugins } from '@capacitor/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
const { Storage } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router:Router,
    private http: HttpClient
  ) {
    this.initializeApp();
  }

  initializeApp() {
    
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    //Subscribe on resume
    this.platform.resume.subscribe(async () => {
      let paymentInProgress = await Storage.get({key: "paymentSessionID"});
      if (paymentInProgress){
        let sessionId = paymentInProgress.value;
        // Remove key for future launch
        Storage.remove({key: "paymentSessionID"});
        console.log("========== NEED TO CHECK STATUS FOR PAYMENT")
        const options = {
          headers: new HttpHeaders({
              'content-type': 'application/json',
          })
      };
        let params = {
          "sessionId" : sessionId
        }
        console.log(params)
        this.http.post("https://app-e06ec9e7-b121-44fa-a383-54bbda3f9706.cleverapps.io/paymentCheckStatus/", params,options)
        .subscribe(async res => {
            console.log(res)
            let status = res["status"]
            if (status=="OK"){
              this.router.navigateByUrl("/payment-ok")
            }
            else{
              this.router.navigateByUrl("/payment-ko")
            }
        })
      }
    });
  }
}
