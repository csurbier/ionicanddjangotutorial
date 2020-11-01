import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentOKPage } from './payment-ok.page';

describe('PaymentOKPage', () => {
  let component: PaymentOKPage;
  let fixture: ComponentFixture<PaymentOKPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentOKPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentOKPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
