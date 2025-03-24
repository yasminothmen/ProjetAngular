import { TestBed } from '@angular/core/testing';

import { EmploieService } from './emploie.service';

describe('EmploieService', () => {
  let service: EmploieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmploieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
