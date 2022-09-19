import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';

import { AccountPage } from './account.page';
import { OrdersComponent } from 'src/app/components/orders/orders.component';
import {EditProfileComponent} from 'src/app/components/edit-profile/edit-profile.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPageRoutingModule
  ],
  declarations: [AccountPage, OrdersComponent,EditProfileComponent],
  entryComponents: [EditProfileComponent]
})
export class AccountPageModule {}
