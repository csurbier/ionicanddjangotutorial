import { TestBed } from '@angular/core/testing';

import { NavDataServiceService } from './nav-data-service.service';

describe('NavDataServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavDataServiceService = TestBed.get(NavDataServiceService);
    expect(service).toBeTruthy();
  });
});
