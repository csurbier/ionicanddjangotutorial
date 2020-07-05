import { TestBed } from '@angular/core/testing';

import { ApiDjangoService } from './api-django.service';

describe('ApiDjangoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiDjangoService = TestBed.get(ApiDjangoService);
    expect(service).toBeTruthy();
  });
});
