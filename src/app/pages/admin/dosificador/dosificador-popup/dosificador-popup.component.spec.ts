import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DosificadorPopupComponent } from './dosificador-popup.component';

describe('DosificadorPopupComponent', () => {
  let component: DosificadorPopupComponent;
  let fixture: ComponentFixture<DosificadorPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DosificadorPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DosificadorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
