import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPagePage } from './payment-page.page';

describe('PaymentPagePage', () => {
  let component: PaymentPagePage;
  let fixture: ComponentFixture<PaymentPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
