import { Component,OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ApiserviceService, ConnectionStatus } from './services/apiservice.service'
import { TranslateService } from '@ngx-translate/core';
import {
  Plugins,
  StatusBarStyle,
} from '@capacitor/core';
import { Router } from '@angular/router';
import { NavDataServiceService } from './services/nav-data-service.service';
import { UserManagerProviderService } from './services/user-manager-provider.service';
import { UtilsProviderService } from './services/utils-provider';
import { AuthenticationService } from './services/authentication.service';
import { BehaviorSubject } from 'rxjs';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { User } from './services/entities';
import { TranslateConfigService } from './services/translate-config.service';
import {delay} from 'rxjs/operators';
const { StatusBar } = Plugins;
const { App, BackgroundTask } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent  implements OnInit{
  userConnected = true; 
  translate: TranslateService;
  constructor(
    private platform: Platform,
    public apiService: ApiserviceService,
    public router: Router,
    public navDataService: NavDataServiceService,
    public userManager: UserManagerProviderService,
    public utilsProvider: UtilsProviderService,
    private screenOrientation: ScreenOrientation,
    public translateConfigService: TranslateConfigService,
    public translateService: TranslateService,
    public authentificationService: AuthenticationService) {
      this.translateConfigService.getDefaultLanguage();
    this.initializeApp();
   
  }
 

  ngOnInit() {
   
  }

   
  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is("capacitor")) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
   
        StatusBar.setStyle({
          style: StatusBarStyle.Dark
        });

      }
       

    
      
      //   this.splashScreen.hide();
      //Subscribe on resume
      this.platform.resume.subscribe(() => {
        
       
         

        
      });

      // Quit app
      this.platform.pause.subscribe(() => {
       
         

        
      });
    });

    
  }

 
  authenticate() {
    console.log("--------- need to authenticate ---------")
    this.router.navigateByUrl("/register").then((done)=>{
      
    })
  }
 
  

}
