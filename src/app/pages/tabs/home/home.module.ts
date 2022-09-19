import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { SwiperModule } from 'swiper/angular';

import { HomePage } from './home.page';
import { BannerComponent } from 'src/app/components/banner/banner.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SwiperModule, ComponentsModule
  ],
  declarations: [HomePage, BannerComponent]
})
export class HomePageModule {}
