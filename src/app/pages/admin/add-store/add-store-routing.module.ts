import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddStorePage } from './add-store.page';

const routes: Routes = [
  {
    path: '',
    component: AddStorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddStorePageRoutingModule {}
