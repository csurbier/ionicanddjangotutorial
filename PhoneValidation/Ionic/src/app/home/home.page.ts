import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiDjangoService } from '../services/api-django.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  formValue = {phoneNumber: '', test: ''};
  form: FormGroup;
  preferredCountries = ["fr","gb","us"]
  constructor(public apiService:ApiDjangoService,
    public router:Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      phoneNumber: new FormControl({
        value: this.formValue.phoneNumber
      })
    });
  }

  get phoneNumber() { return this.form.get('phoneNumber'); }

  onSubmit() {
    console.log(this.phoneNumber.value);
    if (this.apiService.networkConnected){
      let formatedNumber = this.phoneNumber.value.internationalNumber
      this.apiService.sendSmsCode(formatedNumber).subscribe((results)=>{
        if (results){
          let statuts = results["status"]
          if (statuts=="OK"){
            let code = results["code"]
            this.navData.setDataWithoutId({
                  "phoneNumber": formatedNumber,
                  "smscode": code
                })
                this.router.navigate(['/sms-code']).catch(err => console.error(err));
          }
          else{
            //Display error
          }
         
        }
        else{
          //Display error
        }
      })
    }    
  }


}
