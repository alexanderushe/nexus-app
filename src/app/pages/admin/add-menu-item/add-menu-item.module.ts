import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMenuItemPageRoutingModule } from './add-menu-item-routing.module';

import { AddMenuItemPage } from './add-menu-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMenuItemPageRoutingModule
  ],
  declarations: [AddMenuItemPage]
})
export class AddMenuItemPageModule {}
