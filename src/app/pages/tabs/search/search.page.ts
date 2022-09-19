import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Restaurant } from 'src/app/models/restaurant.model';
// import { AddressService } from 'src/app/services/address/address.service';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy {

  @ViewChild('searchInput') sInput;
  model: any = {
    icon: 'search-outline',
    title: 'No Restaurants Found'
  };
  isLoading: boolean;
  query: any;
  restaurants: Restaurant[] = [];

  startAt = new Subject();
  endAt = new Subject();

  startObs = this.startAt.asObservable();
  endObs = this.endAt.asObservable();

  querySub: Subscription;
  // addressSub: Subscription;
  location: any = {};

  constructor(
    private api: ApiService,
    public global: GlobalService
    // private addressService: AddressService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.sInput.setFocus();
    }, 500);
    this.querySub = combineLatest(this.startObs, this.endObs).subscribe(async (val) => {
      console.log(val);
      await this.queryResults(val[0], val[1]);
    });
    // this.addressSub = this.addressService.addressChange.subscribe(address => {
    //   console.log('address', address);
    //   if(address && address?.lat) {
    //     this.location = address;
    //     if(this.query?.length > 0) {
    //       this.querySearch();
    //     }
    //   }
    // }, e => {
    //   console.log(e);
    //   this.global.errorToast();
    // });
  }

  queryResults(start, end) {
    this.isLoading = true;
    this.api.collection('restaurants', ref => ref.orderBy('shortName').startAt(start).endAt(end))
      .valueChanges()
      .pipe(take(1))
      .subscribe((data: any) => {
        this.restaurants = data;
        this.isLoading = false;
      }, e => {
        this.isLoading = false;
        console.log(e);
        this.global.errorToast();
      });
  }

  async onSearchChange(event) {
    console.log(event.detail.value);
    this.query = event.detail.value.toLowerCase();
    this.querySearch();
  }

  querySearch() {
    this.restaurants = [];
    if(this.query.length > 0) {
      this.startAt.next(this.query);
      // it is a PUA code, used to match query that start with querytext
      this.endAt.next(this.query + '\uf8ff');
    }
  }

  ngOnDestroy() {
    if(this.querySub) {this.querySub.unsubscribe();}
    // if(this.addressSub) this.addressSub.unsubscribe();
  }

}
