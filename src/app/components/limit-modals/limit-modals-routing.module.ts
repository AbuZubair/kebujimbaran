import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LimitModalsPage } from './limit-modals.page';

const routes: Routes = [
  {
    path: '',
    component: LimitModalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LimitModalsPageRoutingModule {}
