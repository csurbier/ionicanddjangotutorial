import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ApiDjangoService } from '../app/services/api-django.service'
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public apiService: ApiDjangoService,
    public storage : Storage
  ) {
    this.initializeApp();
  }

  accessAuthorizedWithUrl() {
    //Aks list of users
    this.apiService.getUsers().subscribe((list)=>{
      console.log(JSON.stringify(list))
    })
  }


  getToken() {
    console.log("Pas deja token ")
    this.apiService.checkOauthToken().then((token) => {
      if (token) {
        console.log("Retour WS token "+token+" on sauve token en local "+token)
        this.accessAuthorizedWithUrl()
      }
      else {
        // Get token
        this.apiService.getOAuthToken().then((token) => {
          if (token) {
            console.log("Retour WS token "+token+" on sauve token en local "+token)
            this.accessAuthorizedWithUrl()
          }
          else {
              console.log("ERREUR RETOUR TOKEN");
   
          }
        });
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      console.log("========== INIT APP ==============")
      // check if we have a token to use API
      this.apiService.checkOauthToken().then((result) => {
        if (result) {
          console.log("ACCESS DIRECT  Deja token " + result);
          this.accessAuthorizedWithUrl()
        }
        else {

          console.log("ACCESS DIRECT PAS DE TOKEN TOKEN")
          this.getToken()
        }
      });
    });
  }
}
