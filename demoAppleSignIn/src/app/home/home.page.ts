import { Component } from '@angular/core';
import { Plugins } from "@capacitor/core";
const { IDAppleSignInPlugIn } = Plugins
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  signin: null ;
  constructor() {}

    doAppleLogin(){
   
     
     IDAppleSignInPlugIn.doAppleLogin().then((info)=>{
      if (info){
        console.log("on a info ")
        console.log(info)
        let identityTokenString = info["identityTokenString"]
        if (identityTokenString){
          console.log("on recoit "+identityTokenString)
        }
      }
      else{
        console.log("Pas de info")
      }
 
     })
      
  }
}
