import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
const { Geolocation } = Plugins;
import { Plugins } from '@capacitor/core';
declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
   
  items: any;
  autocomplete: any;
  acService: any;
  placesService: any;
  selectedItem: any;
  buttonDisabled = true;
  sessionToken: any;
  currentLon: any;
  currentLat: any;
  destinationCity : string;
  zipCode : string="";
  constructor(
    public platform: Platform) {
    this.initPage()
  }



  geoloc() {
    return new Promise(async resolve => {
      if (this.platform.is('capacitor')) {
         
        const position = await Geolocation.getCurrentPosition();
        if (position){
          resolve(position);
        }
        else{
           
        }
        
        console.log("------  PLATFORM capacitor");
       
      }
      else {
        // webgeoloc
      
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

  goBack() {
   
  }

  dismiss() {
    console.log("Clear search")
    this.items = [];
    this.autocomplete = {
      query: ''
    };
   
  }
 
  initPage() {
    // Create a new session token.
    this.sessionToken = new google.maps.places.AutocompleteSessionToken();
    this.acService = new google.maps.places.AutocompleteService();
    this.items = [];
    this.autocomplete = {
      query: ''
    };
  }

  async ionViewWillEnter() {
    this.items=[]
    this.autocomplete.query=""
    
    const position = await Geolocation.getCurrentPosition();
     
     if (position) {
      console.log(position)
       this.currentLat = position.coords.latitude
       this.currentLon = position.coords.longitude
     }
    
  } 

  ngOnInit() {

  } 
   
  validDestination() {
    if (this.selectedItem == undefined) {
      // should display a message to the user
      console.log("Enter a destination")
    }
    else {
      let latitude = this.selectedItem.latitude;
      let longitude = this.selectedItem.longitude;
      console.log("Ok selected item "+JSON.stringify(this.selectedItem))
    }
  }

  chooseItem(item: any) {
    console.log('modal > chooseItem > item > ', item);
    console.log(item)
    this.selectedItem = item;
    this.items = [];
    this.autocomplete.query = item.structured_formatting.main_text + " - " + item.structured_formatting.secondary_text;
    this.buttonDisabled = false;
    if (item.structured_formatting.secondary_text.indexOf(",")>0){
      let lieuSplitted = item.structured_formatting.secondary_text.split(",",1); 
      this.destinationCity  = lieuSplitted[0]
    }
    else{
      this.destinationCity  = item.structured_formatting.main_text
    }
  }

  updateSearch() {
    console.log('modal > updateSearch '+this.autocomplete.query);
    if (this.autocomplete.query == '') {
      this.items = [];
      this.buttonDisabled = true
      return;
    }
    let self = this;
    let config: any;
    if (this.currentLat) {
      let myLatLng = new google.maps.LatLng({lat: this.currentLat, lng: this.currentLon}); 
      config = {
        types: ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
        input: this.autocomplete.query,
        sessionToken: this.sessionToken,
        language: "EN",
        location: myLatLng,
        radius: 500 * 100 //50Km
        //, 
        //componentRestrictions: { country: 'FR,ES,BE' } 
      }

    }
    else {
      config = {
        types: ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
        input: this.autocomplete.query,
        sessionToken: this.sessionToken,
        language:"EN"
        //location: {lat: -34, lng: 151},
        //radius: 1000 * 100 //100Km
        //, 
        //componentRestrictions: { country: 'FR,ES,BE' } 
      }

    }

    console.log(config)
    this.acService.getPlacePredictions(config, function (predictions, status) {
      //console.log('modal > getPlacePredictions > status > ', status);
      self.items = [];
      //console.log("predictions "+JSON .stringify(predictions)) 
      if (predictions) {
        predictions.forEach(function (prediction) {
          self.items.push(prediction);
        });
      }
    });

  }
}
