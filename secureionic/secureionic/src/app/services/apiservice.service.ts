

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable,BehaviorSubject } from 'rxjs';
import { from, of, forkJoin } from 'rxjs';
import { catchError, retry, map,tap } from 'rxjs/operators';
import { AlertController, LoadingController } from '@ionic/angular';
import * as Constant from '../config/constant';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { Network } = Plugins;
const { Storage } = Plugins;
export enum ConnectionStatus {
    Online,
    Offline
  }

@Injectable({
    providedIn: 'root'
})
export class ApiserviceService {

    public status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);
    public tokenSet: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

    public tokenSSO: String = "";
    networkConnected: boolean = true;
    virtualHostName: string = ''
    appName: string = '';
    apiPrefix = "/api"
    loader: any;
    expireDate: any;
    isOnline = false;
    urlPwdOublie: string = '';
    checkUrl: string = '';
    cordovaiOS = false;
    isShowingLoader = false;
    getCustomUserUrl : string =''
    
      // ================ AUTHENTIFICATION METHODS ====================

     getLoginUrl : string=""
    
     getResetPwdUrl : string="";
     getRefreshTokenUrl : string =""
     getMeUrl : string=""
    
    
    
    getUserUrl : string='';
    
    
    getAppProfileUrl : string='';
    
    initProvider(url, app_name, apiPrefix) {
        this.virtualHostName = url;
        this.appName = app_name;
        this.apiPrefix = apiPrefix;
        console.log("init provider appName " + this.appName);
        this.initUrls()
    }

    private initUrls() {
    //Default urls 
       this.checkUrl = this.virtualHostName + this.apiPrefix + "/checkAPI/"
          // ================ AUTHENTIFICATION METHODS ====================
       this.getLoginUrl =  this.virtualHostName + "auth/jwt/create/"
       this.getUserUrl  =  this.virtualHostName + "auth/users/"
        this.getResetPwdUrl = this.virtualHostName + "auth/users/reset_password/"
        this.getRefreshTokenUrl = this.virtualHostName + "auth/jwt/refresh/"
        this.getMeUrl =  this.virtualHostName + "auth/users/me/"
       // =================================================================
        
            this.getUserUrl = this.virtualHostName + this.apiPrefix + "/user/"
            this.getAppProfileUrl = this.virtualHostName + this.apiPrefix + "/appprofile/"
        
      }

    constructor(public http: HttpClient,
        public loadingController: LoadingController,
        public alertCtrl: AlertController,
        public platform : Platform){

        this.initializeNetworkEvents();

         this.initProvider(Constant.domainConfig.virtual_host, Constant.domainConfig.client, "api")
        this.http = http
    }

    public async initializeNetworkEvents() {
        console.log("======== Initialise Network Events ======")
        if (this.platform.is("capacitor")){
            let status = await Network.getStatus();
            if (status["connected"]==false){
                this.networkConnected=false
                this.updateNetworkStatus(ConnectionStatus.Offline);
            }
            else{
                this.networkConnected=true;
                this.updateNetworkStatus(ConnectionStatus.Online);
            }
            let handler = Network.addListener('networkStatusChange', (status) => {
                console.log("Network status changed", status);
                if (status["connected"]==false){
                    this.networkConnected=false
                    this.updateNetworkStatus(ConnectionStatus.Offline);
                }
                else{
                    this.networkConnected=true;
                    this.updateNetworkStatus(ConnectionStatus.Online);
                }
              });




        }
        else{
            if (navigator.onLine){
                this.updateNetworkStatus(ConnectionStatus.Online);
            }
            else{
                this.updateNetworkStatus(ConnectionStatus.Offline);
            }
        }
      }

      private async updateNetworkStatus(status: ConnectionStatus) {
        this.status.next(status);
        this.networkConnected = status == ConnectionStatus.Offline ? false : true;
        console.log("networkConnected "+this.networkConnected)
      }

      public onNetworkChange(): Observable<ConnectionStatus> {
        return this.status.asObservable();
      }

      public getCurrentNetworkStatus(): ConnectionStatus {
        return this.status.getValue();
      }


        // Local Data 
      public setLocalData(key, jsonData) {
        return new Promise(async resolve => {

         //   console.log("=ON enregistre cle "+Constant.domainConfig.client+"-"+key+" valeur "+JSON.stringify(jsonData))
            await Storage.set({key:`${Constant.domainConfig.client}-${key}`,value:JSON.stringify(jsonData)})
            resolve(true)
      
    });
      }

      public removeLocalData(key){
        return new Promise(async resolve => {
            let ret = await Storage.remove({key:`${Constant.domainConfig.client}-${key}`}) 

        });
      }
      // Get cached API result
      public getLocalData(key) {
        return new Promise(async resolve => {
            let ret = await Storage.get({key:`${Constant.domainConfig.client}-${key}`}) 
            
            if (ret.value){
                resolve( JSON.parse(ret.value))
            }
            else{
                resolve(null)
            }
        });
    }


    // ================ AUTHENTIFICATION METHODS ====================
    
    refreshToken(token){
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
         
         let params = {
             "refresh":token
         }
         console.log("=== On demande refresh token avec ",params)
        return this.http.post(this.getRefreshTokenUrl, params, options).pipe(
            tap(response => {
                console.log("=== REFRESH reponse",response)
                this.setLocalData("access",{"access":response["access"]})
                this.setLocalData("refresh",{"refresh":response["refresh"]})
              
            })
        );
    }  

    login(params){
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        
        return new Observable(observer=>{
            this.http.post(this.getLoginUrl, params, options).subscribe(
                (val) => {
                    observer.next(val)
                    observer.complete()
                 },
                 response => {
                     console.log("POST call in error", response);
                     observer.next()
                     observer.complete()
                 },
                () => {
                   
                });
        })
        
    }

    registerUser(params){
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
         
        console.log("URL "+this.getUserUrl)
        
        return new Observable(observer=>{
            this.http.post(this.getUserUrl, params, options).subscribe(
                (val) => {
                    observer.next({"status":"OK","data":val})
                    observer.complete()
                 },
                 response => {
                     console.log("POST call in error", response);
                     observer.next({"status":"KO","error":response})
                     observer.complete()
                 },
               
                () => {
                   
                });
        })
        
    }

    getUserMe(){
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
         
        console.log("URL "+this.getMeUrl)
        
        return new Observable(observer=>{
            this.http.get(this.getMeUrl, options).subscribe(
                (val) => {
                    observer.next({"status":"OK","data":val})
                    observer.complete()
                 },
                 response => {
                     console.log("POST call in error", response);
                     observer.next({"status":"KO","error":response})
                     observer.complete()
                 },
               
                () => {
                   
                });
        })
        
    }

     
        createUser(modelToCreate) {
        // model JSON
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        let params = JSON.stringify(modelToCreate)
        console.log("URL "+this.getUserUrl)
        return this.http.post(this.getUserUrl, modelToCreate, options).pipe(retry(1))
    }


    getAllUser() {
        let url = this.getUserUrl;
        return this.findUser(url)
    }
    
    findUserWithQuery(query) {
        let url = this.getUserUrl + query;
        return this.findUser(url)
    }



    private findUser(url) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return Observable.create(observer => {
            // At this point make a request to your backend to make a real check!
            console.log("call url " + url);
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

    findUserBylogentry(parameter) {
let url = this.getUserUrl+"?logentry="+parameter;
return this.findUser(url)
}
findUserByappprofile(parameter) {
let url = this.getUserUrl+"?appprofile="+parameter;
return this.findUser(url)
}
findUserByfcmdevice(parameter) {
let url = this.getUserUrl+"?fcmdevice="+parameter;
return this.findUser(url)
}
findUserBypassword(parameter) {
let url = this.getUserUrl+"?password="+parameter;
return this.findUser(url)
}
findUserBylast_login(parameter) {
let url = this.getUserUrl+"?last_login="+parameter;
return this.findUser(url)
}
findUserByis_superuser(parameter) {
let url = this.getUserUrl+"?is_superuser="+parameter;
return this.findUser(url)
}
findUserByid(parameter) {
let url = this.getUserUrl+"?id="+parameter;
return this.findUser(url)
}
findUserByemail(parameter) {
let url = this.getUserUrl+"?email="+parameter;
return this.findUser(url)
}
findUserByfirst_name(parameter) {
let url = this.getUserUrl+"?first_name="+parameter;
return this.findUser(url)
}
findUserBylast_name(parameter) {
let url = this.getUserUrl+"?last_name="+parameter;
return this.findUser(url)
}
findUserBydate_joined(parameter) {
let url = this.getUserUrl+"?date_joined="+parameter;
return this.findUser(url)
}
findUserByis_active(parameter) {
let url = this.getUserUrl+"?is_active="+parameter;
return this.findUser(url)
}
findUserByis_staff(parameter) {
let url = this.getUserUrl+"?is_staff="+parameter;
return this.findUser(url)
}
findUserByavatar(parameter) {
let url = this.getUserUrl+"?avatar="+parameter;
return this.findUser(url)
}
findUserBygroups(parameter) {
let url = this.getUserUrl+"?groups="+parameter;
return this.findUser(url)
}
findUserByuser_permissions(parameter) {
let url = this.getUserUrl+"?user_permissions="+parameter;
return this.findUser(url)
}


    getUserDetails(id){
        const options = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.tokenSSO,
                'Content-Type': 'application/json'
            })
        };
        return Observable.create(observer => {
            // At this point make a request to your backend to make a real check!
            this.http.get(this.getUserUrl + id + "/", options)
                .pipe(retry(1))
                .subscribe(res => {
                    this.networkConnected = true
                    observer.next(res);
                    observer.complete();
                }, error => {
                    observer.next(false);
                    observer.complete();
                    console.log(error);// Error getting the data
                });
        });
    }
    updateUser(id, patchParams) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return Observable.create(observer => {
            // At this point make a request to your backend to make a real check!
            this.http.patch(this.getUserUrl + id + "/", patchParams, options)
                .pipe(retry(1))
                .subscribe(res => {
                    this.networkConnected = true
                    observer.next(true);
                    observer.complete();
                }, error => {
                    observer.next(false);
                    observer.complete();
                    console.log(error);// Error getting the data
                });
        });
    }

    putUser(object) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return Observable.create(observer => {
            // At this point make a request to your backend to make a real check!
            this.http.put(this.getUserUrl + object.id + "/", object, options)
                .pipe(retry(1))
                .subscribe(res => {
                    this.networkConnected = true
                    observer.next(true);
                    observer.complete();
                }, error => {
                    observer.next(false);
                    observer.complete();
                    console.log(error);// Error getting the data
                });
        });
    }
    deleteUser(id) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return  this.http.delete(this.getUserUrl + id + "/", options).pipe(retry(1))


    }    
    createAppProfile(modelToCreate) {
        // model JSON
        const options = {
            headers: new HttpHeaders({
                
                'Content-Type': 'application/json'
            })
        };

       
        console.log("URL "+this.getAppProfileUrl)
        return this.http.post(this.getAppProfileUrl, modelToCreate, options).pipe(retry(1))
    }


    getAllAppProfile() {
        let url = this.getAppProfileUrl;
        return this.findAppProfile(url)
    }
    
    findAppProfileWithQuery(query) {
        let url = this.getAppProfileUrl + query;
        return this.findAppProfile(url)
    }



    private findAppProfile(url) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return Observable.create(observer => {
            // At this point make a request to your backend to make a real check!
            console.log("call url " + url);
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

    findAppProfileByid(parameter) {
let url = this.getAppProfileUrl+"?id="+parameter;
return this.findAppProfile(url)
}
findAppProfileByuser(parameter) {
let url = this.getAppProfileUrl+"?user="+parameter;
return this.findAppProfile(url)
}
findAppProfileByfacebookToken(parameter) {
let url = this.getAppProfileUrl+"?facebookToken="+parameter;
return this.findAppProfile(url)
}
findAppProfileBygoogleToken(parameter) {
let url = this.getAppProfileUrl+"?googleToken="+parameter;
return this.findAppProfile(url)
}
findAppProfileByappleToken(parameter) {
let url = this.getAppProfileUrl+"?appleToken="+parameter;
return this.findAppProfile(url)
}
findAppProfileByonline(parameter) {
let url = this.getAppProfileUrl+"?online="+parameter;
return this.findAppProfile(url)
}
findAppProfileBylastConnexionDate(parameter) {
let url = this.getAppProfileUrl+"?lastConnexionDate="+parameter;
return this.findAppProfile(url)
}
findAppProfileByvalid(parameter) {
let url = this.getAppProfileUrl+"?valid="+parameter;
return this.findAppProfile(url)
}
findAppProfileBystripeCustomerId(parameter) {
let url = this.getAppProfileUrl+"?stripeCustomerId="+parameter;
return this.findAppProfile(url)
}
findAppProfileBystripePaymentMethodId(parameter) {
let url = this.getAppProfileUrl+"?stripePaymentMethodId="+parameter;
return this.findAppProfile(url)
}
findAppProfileBystripeSubscriptionId(parameter) {
let url = this.getAppProfileUrl+"?stripeSubscriptionId="+parameter;
return this.findAppProfile(url)
}
findAppProfileByrefSubscription(parameter) {
let url = this.getAppProfileUrl+"?refSubscription="+parameter;
return this.findAppProfile(url)
}
findAppProfileBysubscriptionValid(parameter) {
let url = this.getAppProfileUrl+"?subscriptionValid="+parameter;
return this.findAppProfile(url)
}
findAppProfileBysubscriptionDate(parameter) {
let url = this.getAppProfileUrl+"?subscriptionDate="+parameter;
return this.findAppProfile(url)
}
findAppProfileBysubscriptionTransactionId(parameter) {
let url = this.getAppProfileUrl+"?subscriptionTransactionId="+parameter;
return this.findAppProfile(url)
}
findAppProfileBysubscriptionCancel(parameter) {
let url = this.getAppProfileUrl+"?subscriptionCancel="+parameter;
return this.findAppProfile(url)
}
findAppProfileBypurchaseId(parameter) {
let url = this.getAppProfileUrl+"?purchaseId="+parameter;
return this.findAppProfile(url)
}
findAppProfileBypushAccepted(parameter) {
let url = this.getAppProfileUrl+"?pushAccepted="+parameter;
return this.findAppProfile(url)
}
findAppProfileBycreatedAt(parameter) {
let url = this.getAppProfileUrl+"?createdAt="+parameter;
return this.findAppProfile(url)
}
findAppProfileByupdatedAt(parameter) {
let url = this.getAppProfileUrl+"?updatedAt="+parameter;
return this.findAppProfile(url)
}


    getAppProfileDetails(id){
        const options = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.tokenSSO,
                'Content-Type': 'application/json'
            })
        };
        return Observable.create(observer => {
            // At this point make a request to your backend to make a real check!
            this.http.get(this.getAppProfileUrl + id + "/", options)
                .pipe(retry(1))
                .subscribe(res => {
                    this.networkConnected = true
                    observer.next(res);
                    observer.complete();
                }, error => {
                    observer.next(false);
                    observer.complete();
                    console.log(error);// Error getting the data
                });
        });
    }
    updateAppProfile(id, patchParams) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return Observable.create(observer => {
            // At this point make a request to your backend to make a real check!
            this.http.patch(this.getAppProfileUrl + id + "/", patchParams, options)
                .pipe(retry(1))
                .subscribe(res => {
                    this.networkConnected = true
                    observer.next(true);
                    observer.complete();
                }, error => {
                    observer.next(false);
                    observer.complete();
                    console.log(error);// Error getting the data
                });
        });
    }

    putAppProfile(object) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return Observable.create(observer => {
            // At this point make a request to your backend to make a real check!
            this.http.put(this.getAppProfileUrl + object.id + "/", object, options)
                .pipe(retry(1))
                .subscribe(res => {
                    this.networkConnected = true
                    observer.next(true);
                    observer.complete();
                }, error => {
                    observer.next(false);
                    observer.complete();
                    console.log(error);// Error getting the data
                });
        });
    }
    deleteAppProfile(id) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return  this.http.delete(this.getAppProfileUrl + id + "/", options).pipe(retry(1))


    }    
    

       //Override 
    async showNoNetwork() {
        let alert = await this.alertCtrl.create({
            header: 'Désolé',
            message: 'Pas de réseau détecté. Merci de vérifier votre connexion 3G/4G ou Wifi',
            buttons: ['OK']
        });
        return await alert.present();

    }

   
    async showLoading() {
     
      console.log("SHOW LOADING")
      if (!this.isShowingLoader){
        this.isShowingLoader=true
          this.loader = await this.loadingController.create({
            message:  'Merci de patienter',
            duration: 4000
          });
          return await this.loader.present();
        
      }
     
    }
  
  
  
    async stopLoading() {
     
      console.log("STOP LOADING?")
      if (this.loader){
        this.loader.dismiss()
        this.loader =  null
        this.isShowingLoader=false
      }
    
    }
    
     public async showLoadingMessage(message) {
      this.loader = await this.loadingController.create({
        message: message,
      });
      this.loader.present();
    }
  
  
  

    /**
    * Show error message  
    *
    * @param text - The message to show
    * 
    */
    async showError(text) {
        let alert = await this.alertCtrl.create({
            header: 'Erreur',
            message: text,
            buttons: ['OK']
        });
        return await alert.present();
    }

    /**
    * Show a message  
    *
    * @param title - The title of the message to show
    * @param message - The text of the message to show
    * 
    */
    async showMessage(title, message) {
        let alert = await this.alertCtrl.create({
            header: title,
            message: message,
            buttons: ['OK']
        });
        return await alert.present();
    }

 
    checkAPI() {
        return Observable.create(observer => {
            // At this point make a request to your backend to make a real check!
            this.http.get(this.checkUrl)
                .pipe(
                    retry(1)
                )
                .subscribe(res => {
                    this.networkConnected = true
                    observer.next(true);
                    observer.complete();
                }, error => {
                    observer.next(false);
                    observer.complete();
                });
        });
    }

   

     

    sendResetPasswordLink(email) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        let postParams = {
            'email' : email
        }
        return Observable.create(observer => {
            // At this point make a request to your backend to make a real check!
            this.http.post(this.urlPwdOublie, postParams, options)
                .pipe(retry(1))
                .subscribe(res => {
                    this.networkConnected = true
                    observer.next(true);
                    observer.complete();
                }, error => {
                    observer.next(false);
                    observer.complete();
                    console.log(error);// Error getting the data
                });
        });
    }
      

}
