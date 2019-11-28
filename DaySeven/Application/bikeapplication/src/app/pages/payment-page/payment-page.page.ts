import { Component, OnInit } from '@angular/core';
import { ApiDjangoService } from 'src/app/services/api-django.service';
declare var Stripe;
@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.page.html',
  styleUrls: ['./payment-page.page.scss'],
})
export class PaymentPagePage implements OnInit {
  stripe = Stripe("pk_test_vgNZGTXEF76HVvSJF5Q7Z8UW"); //TO Put stripe test key or production key
  card: any;
  paymentIntent: any;
  form = { firstName: '', lastName: "", email: '', address: '', zipCode: "" };
  submitDone = false;
  priceToPay = 10; //10$

  constructor(public apiService: ApiDjangoService) {
  }


  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log("on enter")

    if (this.apiService.networkConnected) {
      let price = this.priceToPay * 100;
      this.apiService.getPaymentIntent(price).subscribe((results) => {
        console.log(JSON.stringify(results))
        this.paymentIntent = results;
        this.setupStripe()
      })
    }
    else {
      this.apiService.showNoNetwork()
    }

  }

  ionViewDidEnter() {
    this.setupStripe();
  }


  setupStripe() {
    let elements = this.stripe.elements({ locale: "fr" });
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.card = elements.create('card', { hidePostalCode: true, style: style });

    this.card.mount('#card-element');

    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    var form = document.getElementById('payment-form');
    if (form) {
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (this.form.firstName.length <= 0) {
          this.apiService.showError("Please enter your firstName")
          return
        }
        if (this.form.email.length <= 0) {
          this.apiService.showError("Please enter your email")
          return
        }
        if (this.form.address.length <= 0) {
          this.apiService.showError("Please enter your address")
          return
        }
        if (this.form.zipCode.length <= 0) {
          this.apiService.showError("Please enter your zip code")
          return
        }

        if (!this.submitDone) {
          this.submitDone = true

          let client_secret = this.paymentIntent["client_secret"]
          this.apiService.showLoading()
          this.stripe.handleCardPayment(
            client_secret,
            this.card,
            {
              payment_method_data: {
                billing_details: {
                  address: {
                    line1: this.form.address,
                    postal_code: this.form.zipCode
                    //country: this.form.pays
                  },
                  email: this.form.email,
                  name: this.form.firstName + " " + this.form.lastName
                },
              },
              receipt_email: this.form.email
            }
          ).then((result) => {
            // Handle result.error or result.paymentIntent

            console.log(JSON.stringify(result))
            if (result.error) {
              this.apiService.stopLoading()
              var errorElement = document.getElementById('card-errors');
              errorElement.textContent = result.error.message;
            }
            else {
              //Payment has been done, do whatever you want such as sending payment information to the backend
            }
          });
        }

      });
    }

  }


}
