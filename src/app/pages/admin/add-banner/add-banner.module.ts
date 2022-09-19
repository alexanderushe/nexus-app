import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddBannerPageRoutingModule } from './add-banner-routing.module';

import { AddBannerPage } from './add-banner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddBannerPageRoutingModule
  ],
  declarations: [AddBannerPage]
})
export class AddBannerPageModule {}
