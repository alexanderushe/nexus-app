import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMenuItemPage } from './add-menu-item.page';

const routes: Routes = [
  {
    path: '',
    component: AddMenuItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMenuItemPageRoutingModule {}
