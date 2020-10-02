import { ApiServiceService } from './../api-service.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public apiService:ApiServiceService) {


  }

  clickButton(){
    this.apiService.showLoader().then(()=>{
      this.apiService.getJsonData().subscribe((data)=>{
        console.log(data)
        this.apiService.stopLoader()
      })
    })
  
  }
}
