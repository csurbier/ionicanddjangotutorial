import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
 
import { Plugins } from '@capacitor/core';
import { ApiserviceService } from './apiservice.service';
const { Storage } = Plugins;
 
const TOKEN_KEY = 'access';
const REFRESH_TOKEN_KEY = 'refresh';

 
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  refresh=''
  constructor(private apiService:ApiserviceService) {
    this.loadToken();
  }
 
  loadToken() {
    this.apiService.getLocalData(TOKEN_KEY).then((value:string)=>{
      if (value){
        console.log('set token: ', value);
        this.token = value["access"];
        this.apiService.getLocalData(REFRESH_TOKEN_KEY).then((value:string)=>{
          this.refresh=value["refresh"]
          this.isAuthenticated.next(true);
        })       
      }
      else{
        console.log("=PAS DE TOKEN PAS LOGGE")
        this.isAuthenticated.next(false);
      }
    })
   
  }

  login(params){
    return new Promise(async resolve => {
    this.apiService.login(params).subscribe((resultat)=>{
       if (resultat) {
          let accessToken = resultat["access"]
          let refreshToken = resultat["refresh"]
          this.apiService.setLocalData("access",{"access":accessToken})
          this.apiService.setLocalData("refresh",{"refresh":refreshToken})
          this.token = accessToken;
          this.refresh=refreshToken
          this.isAuthenticated.next(true);
         
         resolve(true)
        }
      else{
        resolve(false)
      }
      })
    })
  }
 
  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return new Promise(async resolve => {
       this.apiService.removeLocalData(TOKEN_KEY).then(()=>{
          this.apiService.removeLocalData(REFRESH_TOKEN_KEY).then(()=>{
            resolve()
          }
        )
       });
    })
  }

  refreshToken(){
    return this.apiService.refreshToken(this.refresh)
  }
}