import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
