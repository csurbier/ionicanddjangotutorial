import { TestBed } from '@angular/core/testing';

import { UserManagerProviderService } from './user-manager-provider.service';

describe('UserManagerProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserManagerProviderService = TestBed.get(UserManagerProviderService);
    expect(service).toBeTruthy();
  });
});
