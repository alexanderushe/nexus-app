import { Component, ElementRef, OnInit, AfterViewInit, Renderer2, ViewChild, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GoogleMapsService } from 'src/app/services/location/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map', {static: true}) mapElementRef: ElementRef;
  @Input() update = false;
  @Input() center = {lat:  -17.759794719660572, lng: 31.088952654533824};
  @Output() location: EventEmitter<any> = new EventEmitter();
  googleMaps: any;
  map: any;
  marker: any;
  mapListener: any;
  mapChange: Subscription;

  constructor(
    private maps: GoogleMapsService,
    private renderer: Renderer2,
    private locationService: LocationService
    ) { }

  ngOnInit() {}

  async ngAfterViewInit() {
    await this.initMap();
    this.mapChange = this.maps.markerChange.subscribe(async (loc) => {
      if(loc?.lat) {
        console.log('loc: ', loc);
        console.log('maps: ', this.googleMaps);
        const googleMaps = this.googleMaps;
        const location = new googleMaps.LatLng(loc.lat, loc.lng);
        this.map.panTo(location);
        this.marker.setMap(null);
        await this.addMarker(location);
      }
    });
  }

  async initMap() {
    try {
      if(!this.update) {
        const position = await this.locationService.getCurrentPosition();
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        await this.loadMap();
        this.getAddress(this.center.lat, this.center.lng);
      } else {
        await this.loadMap();
      }
    } catch(e) {
      console.log(e);
      this.center = { lat:  -17.759794719660572,
        lng: 31.088952654533824 };
      this.loadMap();
      this.getAddress(this.center.lat, this.center.lng);
    }
  }

  async loadMap() {
    try {
      const googleMaps: any = await this.maps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const style = [
        {
          featureType: 'all',
          elementType: 'all',
          stylers: [
            { saturation: -100 }
          ]
        }
      ];
      const mapEl = this.mapElementRef.nativeElement;
      const location = new googleMaps.LatLng(this.center.lat, this.center.lng);
      this.map = new googleMaps.Map(mapEl, {
        center: location,
        zoom: 15,
        scaleControl: false,
        streetViewControl: false,
        zoomControl: false,
        overviewMapControl: false,
        mapTypeControl: false,
        mapTypeControlOptions: {
          mapTypeIds: [googleMaps.MapTypeId.ROADMAP, 'nexus']
        }
      });
      const mapType = new googleMaps.StyledMapType(style, { name: 'Grayscale' });
      this.map.mapTypes.set('nexus', mapType);
      this.map.setMapTypeId('nexus');
      this.renderer.addClass(mapEl, 'visible');
      this.addMarker(location);
    } catch(e) {
      console.log(e);
    }
  }

  addMarker(location) {
    const googleMaps: any = this.googleMaps;
    const icon = {
      url: 'assets/icon/location-pin.png',
      scaledSize: new googleMaps.Size(50, 50),
    };
    this.marker = new googleMaps.Marker({
      position: location,
      map: this.map,
      icon,
      draggable: true,
      animation: googleMaps.Animation.DROP
    });
    this.mapListener = this.googleMaps.event.addListener(this.marker, 'dragend', () => {
      console.log('markerchange');
      this.getAddress(this.marker.position.lat(), this.marker.position.lng());
    });
  } //this enables marker to change position of the map, when changing the address.

  async getAddress(lat, lng) {
    try {
      const result = await this.maps.getAddress(lat, lng);
      console.log(result);
      const loc = {
        title: result.address_components[0].short_name,
        address: result.formatted_address,
        lat,
        lng
      };
      console.log(loc);
      this.location.emit(loc);
    } catch(e) {
      console.log(e);
    }
  }

  ngOnDestroy() {
    if(this.mapListener) {this.googleMaps.event.removeListener(this.mapListener);}
    if(this.mapChange) {this.mapChange.unsubscribe();}
  }

}
