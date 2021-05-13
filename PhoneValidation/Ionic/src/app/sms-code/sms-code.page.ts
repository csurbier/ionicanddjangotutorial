import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { NavDataServiceService } from '../services/nav-data-service.service';

@Component({
  selector: 'app-sms-code',
  templateUrl: './sms-code.page.html',
  styleUrls: ['./sms-code.page.scss'],
})
export class SmsCodePage implements OnInit {

  phoneNumber= ''
  verificationId="1245";
  code = Array();
  started=false;
  verificationInProgress=false;
  @ViewChild('codesInpunt0') codesInpunt0;
  @ViewChild('codesInpunt1') codesInpunt1;
  @ViewChild('codesInpunt2') codesInpunt2;
  @ViewChild('codesInpunt3') codesInpunt3;
  @ViewChild('codesInpunt4') codesInpunt4;
  @ViewChild('codesInpunt5') codesInpunt5;

  constructor(
    public router: Router,
    public navData:NavDataServiceService,
    public platform : Platform,
    public toastCtrl: ToastController) {
      this.started=false;
  }
  
  ngOnInit() {
    
      let data = this.navData.getDataWithoutId()
      this.phoneNumber = data['phoneNumber'];
      this.verificationId = data['smscode'];
      console.log("route special "+this.phoneNumber+" verif code "+this.verificationId)
     
  }

  ionViewDidEnter() {
    this.codesInpunt0.setFocus();
  } 
 

  changeFocus(inputToFocus) {
    switch (inputToFocus) {
      case 1:
        this.codesInpunt1.setFocus();
        break;

      case 2:
        this.codesInpunt2.setFocus();
        break;

      case 3:
        this.codesInpunt3.setFocus();
        break;
       case 4:
        let enteredCode = this.code[0]+this.code[1] + this.code[2] + this.code[3]   ;
        this.resetCode()
        if (this.verificationInProgress==false){
          this.verificationInProgress=true;
          this.activate(enteredCode)
        }
       break;
     
    }

  }
 

  activate(enteredCode) {
    if (enteredCode){
      console.log("Compare code sms "+enteredCode+" avec "+this.verificationId)
      if (enteredCode.length == 4) {
        console.log(enteredCode);
        console.log("veificationCode is" + this.verificationId);
        if (enteredCode==this.verificationId){
          //Good job
        }
        else{
          
          this.presentToastError()
        }
      }
      else{
        this.presentToastError()
      }
    }
    else{
      this.presentToastAgain()
    }
  }
 
  resetCode(){
      this.code[0]="";
      this.code[1]="";
      this.code[2]="";
      this.code[3]="";
    
  }

  async presentToastAgain(){
    let toast = await this.toastCtrl.create({
      message: "Please enter code again",
      duration: 2000,
      position: 'bottom'
    });

    toast.present();
    this.verificationInProgress=false;
    this.resetCode()
    this.codesInpunt0.setFocus();
  }

  async presentToastError() {
    this.verificationInProgress=false;
    this.codesInpunt0.setFocus();
    let toast = await this.toastCtrl.create({
      message: "Code invalid",
      duration: 2000,
      position: 'bottom'
    });
   toast.present();
  }

}
