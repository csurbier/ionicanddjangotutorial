import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiserviceService } from './apiservice.service'
import { Plugins } from '@capacitor/core';
import * as moment from 'moment';
import { UtilsProviderService } from './utils-provider';
import { Platform } from '@ionic/angular';
import { AuthenticationService } from './../services/authentication.service';
import { User } from './entities';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class UserManagerProviderService {


  userLangue = "fr";

  currentUser: User;
 
 
  constructor(public apiService: ApiserviceService,public utilsProvider:UtilsProviderService,public platform:Platform,public authentificationService:AuthenticationService) {
    console.log('-------- INIT UserManagerProviderService Provider --------- ');
  }
   
 

  saveUser() {
    console.log("===== on sauve user ");
    Storage.set({ key: this.apiService.appName + '_currentUser', value: JSON.stringify(this.currentUser) });
    // sauve online full user
     //TODO
  }

  setUser(user) {
    let aUser = new User().initWithJSON(user);
    this.currentUser = aUser;
    console.log('User ID ' + aUser.id + ' email ' + aUser.email);
    console.log("=====cle " + this.apiService.appName + " on save user ");
    Storage.set({ key: this.apiService.appName + '_currentUser', value: JSON.stringify(user) });
  }


  
  getUser() {
    return new Promise(async resolve => {
      console.log("get User on cherche cle " + this.apiService.appName + '_currentUser')
      let result = await Storage.get({ key: this.apiService.appName + '_currentUser' });
      
      if (result.value) {
        //let user = JSON.parse(result);
        // console.log("on a trouve user pour cle "+JSON.stringify(result.value))
        let aUser = new User().initWithJSON(JSON.parse(result.value));
        this.currentUser = aUser;
        resolve(this.currentUser)
      }
      else {
        //Get user
        console.log("=== On va chercher user")
        this.apiService.getUserMe().subscribe((resultat)=>{
            let status = resultat["status"];
            if (status=="OK") {
              let data = resultat["data"]
              this.setUser(data)
              resolve(this.currentUser)
            }
            else{
              resolve()
            }
        })
      
      }

    });
  }

 
  logoutUser() {
    return new Promise(async resolve => {
      // on doit le passe offline
      console.log("-------- LOGOUT USER --------");
      // logout API
      this.authentificationService.logout().then(async ()=>{
        this.currentUser = null;
        let result = await Storage.remove({ key: this.apiService.appName + '_currentUser' })
        resolve(true)
      })
    });
  }
 
}
