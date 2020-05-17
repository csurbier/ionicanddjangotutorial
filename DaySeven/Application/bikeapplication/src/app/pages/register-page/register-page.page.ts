import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { ApiDjangoService } from '../../services/api-django.service';
import { Router } from '@angular/router';
import CryptoJS from 'crypto-js';
import {Location} from '@angular/common';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.page.html',
  styleUrls: ['./register-page.page.scss'],
})
export class RegisterPagePage implements OnInit {
  registerCredentials = { username: '', email: '', password: '', passwordbis: '' };
  constructor(
    public apiService: ApiDjangoService,
    public location: Location,
    public router: Router) {

  }

  ngOnInit() {
  }

  back(){
    this.location.back();
  }

  register() {

    if (this.registerCredentials.password != this.registerCredentials.passwordbis) {
      this.apiService.showError("Sorry passwords doesn't match");
    }
    else if (this.registerCredentials.username.length == 0 && this.registerCredentials.email.length == 0) {
      this.apiService.showError("Please enter your email and username");
    }
    else {
      
      if (this.apiService.networkConnected) {
        this.apiService.showLoading();

        // Check email
        let queryPath = '?email=' + this.registerCredentials.email;
        this.apiService.findUser(queryPath).subscribe((listUser) => {
          this.apiService.stopLoading()
          console.log(JSON.stringify(listUser))
          if (listUser) {
            let nbUserFound = listUser["count"]
            if (nbUserFound==0){
              let encryptedPassword = CryptoJS.SHA256(this.registerCredentials.password).toString(CryptoJS.enc.Hex);
              let userToCreate = {
                "email": this.registerCredentials.email,
                "username": this.registerCredentials.username,
                "password": encryptedPassword,
                "valid": true,
                "is_active": true,
                "is_staff": false
              }
  
              this.apiService.createUser(userToCreate).subscribe((resultat) => {
                if (resultat) {
                  this.router.navigateByUrl("/show-bikes")
                }
                else {
                  this.apiService.stopLoading();
                  this.apiService.showError("An error occured while registering")
                }
              });
            }
            else{
              this.apiService.showError("An account already exists for this email, please login");
            }
           
          }
          else {
            
            this.apiService.showError("An error occured while registering")
         
          }
        });

      }
    }
  }
  
}
