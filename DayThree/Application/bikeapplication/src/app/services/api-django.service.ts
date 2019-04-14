import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiDjangoService {

  constructor(private http:HttpClient) { }

  doSomeRequest(){
    this.http.get('https:///posts').subscribe((response) => {
      console.log(response);
    });
  }
}
