import { TestBed } from '@angular/core/testing';

import { AlimentarService } from './alimentar.service';

describe('AlimentarService', () => {
  let service: AlimentarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlimentarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
