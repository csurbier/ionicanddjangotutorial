import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ApiDjangoService } from '../app/services/api-django.service'
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
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
    public storage : Storage,
    public network : Network,
    public router: Router
  ) {
    this.initializeApp();
  }

  accessAuthorizedWithUrl() {
    this.router.navigateByUrl("/login-page")
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
          
          this.watchNetwork()
          this.accessAuthorizedWithUrl()
        }
        else {
 
          this.getToken()
        }
      });
    });
  }

  watchNetwork() {
    console.log("================= WATCH NETWORK APP COMPONENT "+this.apiService.networkConnected+" ? ============")
    // watch network for a connection
    this.network.onConnect().subscribe(() => {
      console.log('=====>APP COMPONENT network connect :-(');
      this.apiService.networkConnected = true
      
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
          this.apiService.networkConnected = true
          
        }
      }, 3000);
    });

    // watch network for a disconnect
    this.network.onDisconnect().subscribe(() => {
      console.log('=====>APP COMPONENT network was disconnected :-(');
      this.apiService.networkConnected = false;
      
    });
  }
}
