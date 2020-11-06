import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationProviderService {
 
  authenticationState = new BehaviorSubject(false);
 
  constructor(private plt: Platform) { 
     
  }
   
 
  isAuthenticated() {
    return this.authenticationState.value;
  }
 
}