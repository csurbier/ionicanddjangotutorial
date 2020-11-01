import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentOKPageRoutingModule } from './payment-ok-routing.module';

import { PaymentOKPage } from './payment-ok.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentOKPageRoutingModule
  ],
  declarations: [PaymentOKPage]
})
export class PaymentOKPageModule {}
