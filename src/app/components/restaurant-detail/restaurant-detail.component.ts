import { Component, Input, OnInit } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant.model';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.scss'],
})
export class RestaurantDetailComponent implements OnInit {

  @Input() data: Restaurant;
  @Input() isLoading;
  constructor() { }

  ngOnInit() {}
  getCuisine(cuisine){
  return cuisine.join(', ');
  }

}
