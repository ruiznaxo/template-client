import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DosificadorComponent } from './dosificador.component';

describe('DosificadorComponent', () => {
  let component: DosificadorComponent;
  let fixture: ComponentFixture<DosificadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DosificadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DosificadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
