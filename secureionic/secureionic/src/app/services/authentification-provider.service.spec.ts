import { TestBed } from '@angular/core/testing';

import { AuthentificationProviderService } from './authentification-provider.service';

describe('AuthentificationProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthentificationProviderService = TestBed.get(AuthentificationProviderService);
    expect(service).toBeTruthy();
  });
});
