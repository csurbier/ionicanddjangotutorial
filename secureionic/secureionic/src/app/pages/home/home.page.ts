import { Component } from '@angular/core';
import { ApiserviceService } from 'src/app/services/apiservice.service';
import { UserManagerProviderService } from 'src/app/services/user-manager-provider.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  infoAboutMe : any;
  title = "Authenticated"
  constructor(public userManager:UserManagerProviderService,
    public apiService:ApiserviceService) {
   

    //Get info 
    this.apiService.getUserMe().subscribe((data)=>{
      if (data["status"]=="OK"){
        this.infoAboutMe = data;
      }
      else{
        this.title ="Unauthenticated"
        this.infoAboutMe=null;
      }
    
    })  
 
  }

}
