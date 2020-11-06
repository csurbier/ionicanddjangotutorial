import * as Constant from '../config/constant';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class UtilsProviderService {

    
    
    constructor(public platform:Platform) {

    }

    
    getRandomNumber(min,max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    arraysEqual(a1,a2) {
        /* WARNING: arrays must not contain {objects} or behavior may be undefined */
        return JSON.stringify(a1)==JSON.stringify(a2);
    }
    
    shuffle(unTableau) {
        let ctr = unTableau.length;
        let temp;
        let index;
    
        // While there are elements in the array
        while (ctr > 0) {
    // Pick a random index
            index = Math.floor(Math.random() * ctr);
    // Decrease ctr by 1
            ctr--;
    // And swap the last element with it
            temp = unTableau[ctr];
            unTableau[ctr] = unTableau[index];
            unTableau[index] = temp;
        }
        return unTableau;
    }
}