import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { IonicModule } from '@ionic/angular';
import { LoadingRestaurantComponent } from './loading-restaurant/loading-restaurant.component';
import { EmptyScreenComponent } from './empty-screen/empty-screen.component';
import { SearchLocationComponent } from './search-location/search-location.component';
import { ProgressComponent } from './progress/progress.component';


@NgModule({
  declarations: [RestaurantComponent, LoadingRestaurantComponent, EmptyScreenComponent, SearchLocationComponent,ProgressComponent],
  imports: [
    CommonModule, SwiperModule,IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  exports: [
    RestaurantComponent,LoadingRestaurantComponent, EmptyScreenComponent, SearchLocationComponent,ProgressComponent
  ],
  //only those components not defined in template. modals, will come up here
  entryComponents:[SearchLocationComponent]
})

export class ComponentsModule { }
