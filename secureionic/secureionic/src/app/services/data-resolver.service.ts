import { NavDataServiceService } from './nav-data-service.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
 
@Injectable({
  providedIn: 'root'
})
export class DataResolverService implements Resolve<any> {
 
  constructor(private dataService: NavDataServiceService) { }
 
  resolve(route: ActivatedRouteSnapshot) {
    let id = route.paramMap.get('id');
    return this.dataService.getData(id);
  }
}