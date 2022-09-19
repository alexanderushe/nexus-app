import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-loading-restaurant',
  templateUrl: './loading-restaurant.component.html',
  styleUrls: ['./loading-restaurant.component.scss'],
})
export class LoadingRestaurantComponent implements OnInit {
dummy= Array(10);
  constructor() { }

  ngOnInit() {}

}
