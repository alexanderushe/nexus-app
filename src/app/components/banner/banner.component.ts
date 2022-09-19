import { Component,  EventEmitter,  Input,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Banner } from 'src/app/models/banner.model';
import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, SwiperOptions, Zoom } from 'swiper';
SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})

export class BannerComponent implements OnInit {


  @Input() bannerImages: Banner[]= [];
  slideOptions ={
      slidesPerView: 1.1

    };
  constructor(public router: Router) { }

  ngOnInit() {}
  goToRestaurant(data){
    if(data?.resId){
      this.router.navigate(['/', 'tabs', 'restaurants', data.resId]);
    }
  }

}
