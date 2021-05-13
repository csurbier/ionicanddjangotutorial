import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SmsCodePageRoutingModule } from './sms-code-routing.module';

import { SmsCodePage } from './sms-code.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SmsCodePageRoutingModule
  ],
  declarations: [SmsCodePage]
})
export class SmsCodePageModule {}
