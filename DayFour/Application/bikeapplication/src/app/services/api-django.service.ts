import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiDjangoService {


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
  constructor(public http: HttpClient,
    public storage: Storage) {

  }



  getExpireDate() {
    return Observable.create(observer => {
      this.storage.get(this.appName + '_expireAccessToken').then((date) => {
        if (date) {
          this.expireDate = date;
          console.log("on met en mémoire dateExpire " + date);
          observer.next(this.expireDate);
          observer.complete();
        }
        else {
          observer.next();
          observer.complete();
        }
      })
        .catch(error => {
          observer.next();
          observer.complete();
        })
    });
  }


  checkOauthToken() {
    console.log("on check OAUTH TOKEN");
    return new Promise(resolve => {
      this.storage.get(this.appName + '_accessToken').then((result) => {
        console.log("OK CHECK TOKEN " + result);
        if (result) {
          this.tokenSSO = result
          // Set expire date
          let expireFS = this.getExpireDate().subscribe((date) => {
            // check date expire
            expireFS.unsubscribe()
            let now = Date.now() / 1000;
            console.log("on compare " + this.expireDate + " avec " + now);
            if (Number(this.expireDate) < now) {
              console.log("date expirée, on va chercher nouveau token")
              resolve()
            }
            else {
              resolve(result)
            }
          })
        }
        else {
          resolve()
        }
      });
    });

  }
  getOAuthToken() {
    let url = this.getOauthUrl
    console.log("pas de token appel WS url avec nouveau headers " + url);
    let body = 'client_id=' + this.oAuth2ClientId + '&client_secret=' + this.oAuth2ClientSecret + '&username=' + this.oAuth2Username + '&password=' + this.oAuth2Password + '&grant_type=password';
    //console.log("body "+body);
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': "application/x-www-form-urlencoded",
      })
    };
    return new Promise(resolve => {
      this.http.post(url, body, httpOptions)
        .pipe(
          retry(1)
        )
        .subscribe(res => {
          let token = res["access_token"];
          this.tokenSSO = token
          console.log("ok TOKEN " + token);
          let expireIn = res["expires_in"]; // Secondes
          this.expireDate = (Date.now() / 1000) + expireIn;
          // Save expireDate
          this.storage.set(this.appName + '_expireAccessToken', this.expireDate);
          this.storage.set(this.appName + '_accessToken', this.tokenSSO).then((result) => {
            resolve(token)
          })
        }, error => {

          console.log("ERREUR APPEL TOKEN ");// Error getting the data
          console.log(error)
          resolve()
        });
    });
  }

  getUsers() {
    const options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenSSO,
        'Content-Type': 'application/json'
      })
    };

    let url = this.getUserUrl

    return Observable.create(observer => {
      // At this point make a request to your backend to make a real check!
      console.log("on appelle BACKEND encoded url " + url);
      this.http.get(url, options)
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

}
