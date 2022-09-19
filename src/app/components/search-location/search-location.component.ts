import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/models/address.model';
import { AddressService } from 'src/app/services/address/address.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/location/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent implements OnInit, OnDestroy {

  @Input() from;
  query: string;
  places: any[] = [];
  placeSub: Subscription;
  savedPlaces: Address[] = [];
  addressSub: Subscription;

  constructor(
    private global: GlobalService,
    private maps: GoogleMapsService,
    private locationService: LocationService,
    private addressService: AddressService
  ) { }

  ngOnInit() {
    this.placeSub = this.maps.places.subscribe(places => {
      this.places = places;
    });
    if(this.from) {
      this.getSavedPlaces();
    }
  }

  async getSavedPlaces() {
    this.global.showLoader();
    this.addressSub = this.addressService.addresses.subscribe(addresses => {
      this.savedPlaces = addresses;
    });
    if(this.from === 'home') {await this.addressService.getAddresses(2);}
    else {await this.addressService.getAddresses();}
    this.global.hideLoader();
  }

  selectSavedPlace(place) {
    this.dismiss(place);
  }

  async onSearchChange(event) {
    console.log(event);
    this.global.showLoader();
    this.query = event.detail.value;
    if(this.query.length > 0) {await this.maps.getPlaces(this.query);}
    this.global.hideLoader();
  }

  dismiss(val?) {
    this.global.modalDismiss(val);
  }

  async choosePlace(place) {
    this.global.showLoader();
    console.log(place);
    if(this.from) {
      const savedPlace = await this.savedPlaces.find(x => x.lat === place.lat && x.lng === place.lng);
      if(savedPlace?.lat) {place = savedPlace;}
    }
    this.global.hideLoader();
    this.dismiss(place);
  }

  async getCurrentPosition() {
    try {
      this.global.showLoader();
      const position = await this.locationService.getCurrentPosition();
      const {latitude, longitude} = position.coords;
      const result = await this.maps.getAddress(latitude, longitude);
      console.log(result);
      const place = {
        title: result.address_components[0].short_name,
        address: result.formatted_address,
        lat: latitude,
        lng: longitude
      };
      this.global.hideLoader();
      this.dismiss(place);
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast('Check whether GPS is enabled & the App has its permissions', 5000);
    }
  }

  ngOnDestroy() {
    if(this.placeSub) {this.placeSub.unsubscribe();}
    if(this.addressSub) {this.addressSub.unsubscribe();}
  }

}
