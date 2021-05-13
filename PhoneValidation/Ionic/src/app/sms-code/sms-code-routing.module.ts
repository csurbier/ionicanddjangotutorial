import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SmsCodePage } from './sms-code.page';

const routes: Routes = [
  {
    path: '',
    component: SmsCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmsCodePageRoutingModule {}
