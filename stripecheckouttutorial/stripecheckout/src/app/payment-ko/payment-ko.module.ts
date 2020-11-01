import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentKOPageRoutingModule } from './payment-ko-routing.module';

import { PaymentKOPage } from './payment-ko.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentKOPageRoutingModule
  ],
  declarations: [PaymentKOPage]
})
export class PaymentKOPageModule {}
