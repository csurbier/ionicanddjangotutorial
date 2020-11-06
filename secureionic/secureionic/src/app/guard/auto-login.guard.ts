import { UserManagerProviderService } from './../services/user-manager-provider.service';
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { filter, map, take } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  constructor(private authService: AuthenticationService, private router: Router,private userManager:UserManagerProviderService) { }
 
  canLoad(): Observable<boolean> {    
    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map(isAuthenticated => {
        console.log('Found previous token ?, automatic login '+isAuthenticated);
        if (isAuthenticated) {
          //Load user 
          this.userManager.getUser().then((user)=>{
            console.log("Log user",user)
            
             // Directly open inside area       
           this.router.navigateByUrl('/home', { replaceUrl: true });
          })
         
        } else {          
          // Simply allow access to the login
          return true;
        }
      })
    );
  }
}