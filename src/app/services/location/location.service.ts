import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }
    async getCurrentPosition(){
    if(!Capacitor.isPluginAvailable('Geolocation')){
      return;
    }
    const options: PositionOptions = {
      maximumAge: 3000,
      timeout: 10000,
      enableHighAccuracy: false
    };
    return await Geolocation.getCurrentPosition(options);
  };
}
