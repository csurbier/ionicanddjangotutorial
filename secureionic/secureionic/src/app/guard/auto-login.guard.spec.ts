import { TestBed } from '@angular/core/testing';

import { AutoLoginGuard } from './auto-login.guard';

describe('AutoLoginGuard', () => {
  let guard: AutoLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AutoLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
