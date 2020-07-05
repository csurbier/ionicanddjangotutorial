import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPagePage } from './register-page.page';

describe('RegisterPagePage', () => {
  let component: RegisterPagePage;
  let fixture: ComponentFixture<RegisterPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
