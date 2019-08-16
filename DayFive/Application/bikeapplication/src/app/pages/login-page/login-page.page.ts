import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
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
    public router: Router) {

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

  public forgotPassword(): void {
    this.router.navigateByUrl("/forgot-password")
  }

  public subscribe() {
    this.router.navigateByUrl("/register-page")
  }
}
