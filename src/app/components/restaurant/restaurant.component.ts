import { Component, Input, OnInit } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant.model';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})

export class RestaurantComponent implements OnInit {
@Input() restaurant: Restaurant;
fallbackImage = 'assets/imgs/1.jpg';
  constructor() { }

  ngOnInit() {}
  getCuisine(cuisine){
    return cuisine.join(',');
  }
  onImgError(event){
    event.target.src = this.fallbackImage;
  }
}
