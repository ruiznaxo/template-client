import { TestBed } from '@angular/core/testing';

import { LineaService } from './linea.service';

describe('LineaService', () => {
  let service: LineaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
