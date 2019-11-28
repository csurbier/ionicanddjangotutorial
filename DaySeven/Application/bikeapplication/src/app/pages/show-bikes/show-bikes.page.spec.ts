import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBikesPage } from './show-bikes.page';

describe('ShowBikesPage', () => {
  let component: ShowBikesPage;
  let fixture: ComponentFixture<ShowBikesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowBikesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowBikesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
