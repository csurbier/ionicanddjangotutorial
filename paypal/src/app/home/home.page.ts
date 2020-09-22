import { Component } from '@angular/core';
declare var paypal: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  price;
  priceToPay = 10;
  payPalConfig: any;

  PAYPAL_CLIENT_ID_TEST = "YOURDEVKEY"
  PAYPAL_CLIENT_ID_LIVE = "YOURLIVEKEY"

  PAYPAL_CLIENT_ID = this.PAYPAL_CLIENT_ID_TEST

  constructor() {

    this.price = this.priceToPay + " €"
    let enviroment = ""
    if (this.PAYPAL_CLIENT_ID == this.PAYPAL_CLIENT_ID_TEST) {
      enviroment = "sandbox"
    }
    else {
      enviroment = "live"
    }

    this.payPalConfig = {
      env: enviroment,
      client: {
        sandbox: this.PAYPAL_CLIENT_ID,
      },
      commit: false,
      payment: (data, actions) => {
        // console.log("data is", data, actions);
        return actions.payment.create({
          payment: {
            transactions: [
              { amount: { total: this.priceToPay, currency: 'EUR' } }
            ]
          }
        });
      },
      // Finalize the transaction
      onApprove: (data, actions) => {
        //console.log(data)
        //console.log(actions)
        return actions.order.capture()
          .then((details) => {
            // Show a success message to the buyer
            console.log(details)
            let status = details["status"]
            let id = details["id"]
            if (status == "COMPLETED") {
              this.validPurchase(id)
            }
            else {
              //Status not completed...
            }
            console.log('Transaction completed by ' + details.payer.name.given_name + '!');
          })
          .catch(err => {
            console.log(err);
            // deal with error
          })
      }
      ,
      onError: (err) => {
        // Show an error page here, when an error occurs
        console.log(err)
        // deal with error
      }
    }
  }

  validPurchase(id) {
    // Purchase confirm 
    //Do whatever you want to do
  }

  ionViewDidEnter() {
    paypal.Buttons(this.payPalConfig).render('#paypal-button');
  }


  ngOnInit() {
  }

}
