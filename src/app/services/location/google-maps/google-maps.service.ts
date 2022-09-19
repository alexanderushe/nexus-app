import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  googleMaps: any;
  private oplaces = new BehaviorSubject<any[]>([]);
  private omarkerChange = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private zone: NgZone) {}

  get places(){
    return this.oplaces.asObservable();
  }
  get markerChange(){
    return this.omarkerChange.asObservable();
  }

  loadGoogleMaps(): Promise<any> {
    const win = window as any;
    const gModule = win.google;
    if(gModule && gModule.maps) {
     return Promise.resolve(gModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.googleMapsApiKey
         + '&libraries=places';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if(loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Map SDK is not Available');
        }
      };
    });
  }
  getAddress(lat: number, lng: number ): Promise<any>{
    return new Promise((resolve,reject)=>{
      this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsApiKey}`
      )
      .pipe(
        map(geoData => {
          if(!geoData || !geoData.results || geoData.results.length === 0 ) {throw new Error(null);}
          console.log('results', geoData.results[0]);
          return geoData.results[0];
        })
        ).subscribe(data =>{
          resolve(data);
        }, e =>{
          reject(e);
        });
    });
  }
  async getPlaces(query){
    try{
      if(!this.googleMaps){
        this.googleMaps = await this.loadGoogleMaps();
      }
      const googleMaps: any = this.googleMaps;
      console.log(googleMaps);
      const service = new googleMaps.places.AutocompleteService();
      service.getPlacePredictions({
        input: query,
        componentRestrictions:{
          country: 'ZW'
        }
      }, (predictions)=>{
        const autoCompleteItems = [];
        //accessing the predictions using ngZone to detect change
        this.zone.run(()=>{
          if(predictions !==null){
            predictions.forEach(async (prediction)=>{
              console.log('Predicitons',prediction);
              const latlng: any = await this.geoCode(prediction.description, googleMaps);
              const places: any = {
                title: prediction.structured_formatting.main_text,
                address: prediction.description,
                lat: latlng.lat,
                lng: latlng.lng
              };
              console.log('places', places);
              autoCompleteItems.push(places);
            });
            //pass array to component using rxjs behaviorSubject.
            this.oplaces.next(autoCompleteItems);
          }
        });

      });
    }catch(e){
      console.log(e);
    }
  }
  geoCode(address, googleMaps){
    const latlng = {lat:'',lng:''};
    return new Promise((resolve,reject)=>{
        const geocoder = new googleMaps.Geocoder();
        geocoder.geocode({address}, (results)=>{
          console.log('results',results);
          latlng.lat = results[0].geometry.location.lat();
          latlng.lng = results[0].geometry.location.lng();
          resolve(latlng);
        });
    });
  }
  changeMarkerInMap(location){
    this.omarkerChange.next(location);
  }

}
