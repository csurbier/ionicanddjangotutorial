import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentOKPage } from './payment-ok.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentOKPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentOKPageRoutingModule {}
