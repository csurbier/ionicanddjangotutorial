import { ApiServiceService } from './../api-service.service';
import { Component } from '@angular/core';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  loading=false;
  constructor(public apiService:ApiServiceService) {

    this.apiService.loadingObserver
    .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
    .subscribe((loading) => {
      this.loading = loading
    });
  }

  clickButton(){
      this.apiService.getJsonData().subscribe((data)=>{
        console.log(data)
      })
  }
}
