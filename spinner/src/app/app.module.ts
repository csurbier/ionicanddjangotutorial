import { ApiServiceService } from './api-service.service';
import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { HTTP_INTERCEPTORS} from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { timeout, retryWhen, delay, map, catchError, finalize } from 'rxjs/operators';
@Injectable()
export class AngularInterceptor implements HttpInterceptor {
  constructor(private _loading: ApiServiceService){

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let defaultTimeout = 10000;
      this._loading.setLoading(true, req.url);
   
      return next.handle(req).pipe(timeout(defaultTimeout),
        retryWhen(err=>{
          let retries = 1;
          return err.pipe(
            delay(1000),
            map(error=>{
              if (retries++ ===3){
                this._loading.setLoading(false, req.url);
                throw error
              }
              return error;
            })
          )
        }),catchError(err=>{
          console.log(err)
            this._loading.setLoading(false, req.url);
          return EMPTY
        }), finalize(()=>{
            this._loading.setLoading(false, req.url);
        })
      )
    };
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AngularInterceptor, multi: true } 
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
