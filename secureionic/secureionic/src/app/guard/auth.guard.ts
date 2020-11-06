import { UserManagerProviderService } from './../services/user-manager-provider.service';
import { AuthenticationService } from './../services/authentication.service';
import { Injectable, NgZone } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthenticationService,private userManager:UserManagerProviderService,private router: Router) { }
 
  canLoad(): Observable<boolean> {    
    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map(isAuthenticated => {
        if (isAuthenticated) {  
          this.userManager.getUser().then((user)=>{
            
          })        
          return true;
        } else {          
          this.router.navigateByUrl('/login')
          return false;
        }
      })
    );
  }
}