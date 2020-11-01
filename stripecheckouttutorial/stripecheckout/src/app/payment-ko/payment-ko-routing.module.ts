import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentKOPage } from './payment-ko.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentKOPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentKOPageRoutingModule {}
