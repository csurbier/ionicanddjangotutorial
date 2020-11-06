//translate-config.service.ts
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserManagerProviderService } from './user-manager-provider.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {
 
  constructor(
    private translate: TranslateService,
    public userManager : UserManagerProviderService) { }
 
  async getDefaultLanguage(){
    let language = navigator.language.split('-')[0]; // use navigator lang if available
    language = /(fr|en)/gi.test(language) ? language : 'en';
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang(language);
    this.userManager.userLangue = language;
     
   
  }
 
  setLanguage(setLang) {
    this.translate.use(setLang);
     
  }
 
}
 