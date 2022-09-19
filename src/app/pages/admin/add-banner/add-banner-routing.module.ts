import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddBannerPage } from './add-banner.page';

const routes: Routes = [
  {
    path: '',
    component: AddBannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddBannerPageRoutingModule {}
