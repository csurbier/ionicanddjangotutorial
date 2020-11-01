import { Component, ElementRef, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

declare var Stripe;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  stripe = Stripe("pk_test_XwRn88Fmqzh3966EVK92hpJY00jGOfGKPt");
  
  @ViewChild('stripeButton',{read:ElementRef}) stripeButton : ElementRef;
   constructor(public loadingController:LoadingController,
    private http: HttpClient) {
   

  }
 
  showLoader() {

    this.loadingController.create({
      message: 'Please wait...',
      duration:2000
    }).then((res) => {
      res.present();
    });

  }

  hideLoader() {

    this.loadingController.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });

  }

  

  ngAfterViewInit(){
    const stripeButton = this.stripeButton.nativeElement;
    stripeButton.addEventListener('click', event => {
      console.log("=== ON CLIQUE LE BUTTON ")
      const options = {
        headers: new HttpHeaders({
            'content-type': 'application/json',
        })
    };
    
      this.showLoader()
      // call API
      let params = {
        "currency" : "eur",
        "quantity": 1,
        "price": 1000,
        "productName" : "My product"
      }
      console.log(params)
      this.http.post("https://app-e06ec9e7-b121-44fa-a383-54bbda3f9706.cleverapps.io/create-checkout-session/", params,options)
      .subscribe(async res => {
        console.log(res)
       
         
          let status = res["status"]
          if (status=="OK"){
            let sessionID = res["session"]
            // save session ID  
            await Storage.set({key: "paymentSessionID", value: sessionID});

            //Redirect sur checkout
            this.stripe.redirectToCheckout({ sessionId: sessionID}).then((result) => {
              console.log(result)
            })
          }
          else{
            console.log("===ERROR")
            this.hideLoader()
          }

      }, error => {
           this.hideLoader()
          console.log(error);// Error getting the data
        });
      });
  }
 
}
