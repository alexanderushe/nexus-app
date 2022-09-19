import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddStorePageRoutingModule } from './add-store-routing.module';

import { AddStorePage } from './add-store.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddStorePageRoutingModule, ComponentsModule
  ],
  declarations: [AddStorePage]
})
export class AddStorePageModule {}
