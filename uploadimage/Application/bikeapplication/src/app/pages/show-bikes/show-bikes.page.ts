import { Component, OnInit,ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Geolocation,Geoposition } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { ApiDjangoService } from '../../services/api-django.service';
import { Router } from '@angular/router';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

declare var MarkerClusterer;
declare var google;
@Component({
  selector: 'app-show-bikes',
  templateUrl: './show-bikes.page.html',
  styleUrls: ['./show-bikes.page.scss'],
})
export class ShowBikesPage implements OnInit {

  positionUser : any;
  bikesList : any;
  markersBike : any;
  markerCluster : any; 

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  constructor(public geolocation: Geolocation,
    public apiService: ApiDjangoService,
    public platform : Platform,
    public locac : LocationAccuracy,
    public router: Router) {
      console.log("On va geolocaliser")
      this.apiService.showLoading()
      this.geoloc().then((position)=>{
        this.apiService.stopLoading()
          this.positionUser = position
          if (position){
            this.displayData()
          }
          else{
            this.apiService.showError("Sorry unable to geolocate")
          }
      })  
  
    }



  geoloc() {
    return new Promise(resolve => {
      if (this.platform.is('cordova')) {
        let options = {
          enableHighAccuracy: true,
          maximumAge:0,
          timeout:10000
        };
        console.log("------  PLATFORM CORDOVA");
        this.locac.request(this.locac.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
          this.geolocation.getCurrentPosition(options).then((position: Geoposition) => {
            console.log("============= POSITION  ================");
            console.log(position)
            resolve(position);
          }).catch((err) => {
            console.log("Error GEOLOC " + JSON.stringify(err))
            resolve(false)
          })
        });
      }
      else{
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              console.log("============= POSITION  ================");
              console.log(position)
              //Hardcoded 

              resolve(position);
            },
            error => {

              resolve(false);
            }
          );
        }
      }
    })
  }

  displayData(){
     let latitude = this.positionUser.coords.latitude
     let longitude = this.positionUser.coords.longitude
     this.apiService.showLoading()
     this.apiService.getBikesAround(latitude,longitude).subscribe((data)=>{
       console.log(data)
       this.apiService.stopLoading()
       if (data){
         let nb = data["count"]
         if (nb>0){
          this.markersBike = []
          let latLng = new google.maps.LatLng(this.positionUser.coords.latitude, this.positionUser.coords.longitude);

          let mapOptions = {
            center: latLng,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            for (let bike of data["results"]){
              console.log(JSON.stringify(bike))
              let location = bike.location;
              let coordinates = location.coordinates
              let currentLatitude = coordinates[1];
              let currentLongitude = coordinates[0];
              let urlPicture: string;
              urlPicture = 'assets/imgs/bike.jpg'
              var image = {
                url: urlPicture,
                size: new google.maps.Size(40, 40),
                scaledSize: new google.maps.Size(40, 40)
              };
              let latLng = new google.maps.LatLng(currentLatitude, currentLongitude);
      
              let marker = new google.maps.Marker({
                map: this.map,
                icon: image,
                animation: google.maps.Animation.DROP,
                position: latLng
              });
       
              this.markersBike.push(marker)
            }
      
             
            let styles_marker = [{
              url: 'assets/imgs/pictogroupegardemanger.png',
              height: 40,
              width: 40,
              anchor: [0, -1],
              textColor: '#010A72',
              textSize: 11
            }];
            console.log(this.markersBike)
      
            this.markerCluster = new MarkerClusterer(this.map, this.markersBike,
               { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
            
            
         }
         else{
           this.apiService.showMessage("Sorry","No bikes around you")
         }
       }
     })
  }


  ngOnInit() {
  }

}
