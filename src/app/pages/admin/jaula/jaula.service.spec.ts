import { TestBed } from '@angular/core/testing';

import { JaulaService } from './jaula.service';

describe('JaulaService', () => {
  let service: JaulaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JaulaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
