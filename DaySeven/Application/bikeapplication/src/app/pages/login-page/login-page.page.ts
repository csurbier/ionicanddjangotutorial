import { Component, OnInit } from '@angular/core';
import { Platform,AlertController } from '@ionic/angular';
import { ApiDjangoService } from '../../services/api-django.service';
import { Router } from '@angular/router';
import CryptoJS from 'crypto-js';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage implements OnInit {

  registerCredentials = { email: '', password: '' };

  constructor(
    public apiService: ApiDjangoService,
    public alertController:AlertController,
    public router: Router) {

  }


  async  forgotPassword()  {
     
    const alert = await this.alertController.create({
      header:"Please enter your email",
      message:"We will send you a password reset link",
      inputs: [
        {
          name: 'email',
          type: 'text'
        }],    
       buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              }
            }, {
              text: 'Ok',
              handler: (alertData) => { //takes the data 
                console.log(alertData.email);
                if (alertData.email){
                  this.apiService.sendResetPasswordLink(alertData.email)
                }
                else{
                  //Display error message
                }
            }
            }
          ]
  });
  await alert.present();
  }

  ngOnInit() {

  }

  public connect(): void {
    if (this.apiService.networkConnected) {
      this.apiService.showLoading();
      let password = CryptoJS.SHA256(this.registerCredentials.password).toString(CryptoJS.enc.Hex);
      let queryPath = "?email=" + this.registerCredentials.email + "&password=" + password;
      this.apiService.findUser(queryPath).subscribe((listUsers) => {
        this.apiService.stopLoading();
        if (listUsers) {
          console.log("Find " + JSON.stringify(listUsers));
          this.router.navigateByUrl("/show-bikes")

        }
        else {
          this.apiService.stopLoading();
          this.apiService.showError("Wrong login or password.");

        }
      })
    }
    else {
      this.apiService.showNoNetwork();
    }
  }


  public subscribe() {
    this.router.navigateByUrl("/register-page")
  }
}
