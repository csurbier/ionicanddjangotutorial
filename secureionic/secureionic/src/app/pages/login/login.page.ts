import { TranslateConfigService } from './../../services/translate-config.service';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiserviceService } from 'src/app/services/apiservice.service';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserManagerProviderService } from 'src/app/services/user-manager-provider.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  isIOS=false;

  constructor(public apiService:ApiserviceService,
    public fb: FormBuilder,
    public platform:Platform,
    public router:Router,
    public alertController:AlertController,
    public translateService: TranslateService,
    public authentificationService:AuthenticationService,
    public userManager:UserManagerProviderService) { 
      if (this.platform.is("ios")){
        this.isIOS=true;
      }}
 
  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  
 
    // Easy access for form fields
    get email() {
      return this.credentials.get('email');
    }
    
    get password() {
      return this.credentials.get('password');
    }
    

    async login(){
   
      let email = this.credentials.value["email"]
      let password = this.credentials.value["password"]
      
      if (this.apiService.networkConnected){
        this.apiService.showLoading();
            // Check email
            let params = {
              "email":email,
              "password":password,
            }
            this.authentificationService.login(params).then((resultat)=>{
              this.apiService.stopLoading();
              if (resultat) {
                this.router.navigateByUrl('/home', { replaceUrl: true });
              }
              else{
                this.displayWrongLogin()
            }
          })
            
      }
      else {
        this.apiService.showNoNetwork();
      }
    }
 

  goNext(){
    this.router.navigateByUrl("/home")
  }
 
  async forgetPwd() {
    const alert = await this.alertController.create({
      header: this.translateService.instant("Please enter an email"),
      inputs: [
        {
          name: 'email',
          type: 'text',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: this.translateService.instant("Cancel"),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
             
          }
        }, {
          text: this.translateService.instant("Confirm"),
          handler: (data) => {
            if (data["email"]){
              this.apiService.showLoading().then(()=>{
                this.apiService.sendResetPasswordLink(data["email"]).subscribe(()=>{
                  this.apiService.stopLoading()
                  this.apiService.showMessage(this.translateService.instant("Thanks"),this.translateService.instant("If this email exists on our platform, a reset link will be sent. Please don't forget to check your spams!"))
                })
              })
            
            }
            
          }
        }
      ]
    });

    await alert.present();
  }
  
  
 displayWrongLogin(){
   
  this.apiService.showError(this.translateService.instant("Unable to authenticate. Please check your email/password"))
}
 
}