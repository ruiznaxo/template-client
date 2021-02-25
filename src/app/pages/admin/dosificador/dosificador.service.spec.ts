import { TestBed } from '@angular/core/testing';

import { DosificadorService } from './dosificador.service';

describe('DosificadorService', () => {
  let service: DosificadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DosificadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
