import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentKOPage } from './payment-ko.page';

describe('PaymentKOPage', () => {
  let component: PaymentKOPage;
  let fixture: ComponentFixture<PaymentKOPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentKOPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentKOPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
