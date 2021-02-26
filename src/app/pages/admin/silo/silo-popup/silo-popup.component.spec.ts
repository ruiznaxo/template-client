import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiloPopupComponent } from './silo-popup.component';

describe('SiloPopupComponent', () => {
  let component: SiloPopupComponent;
  let fixture: ComponentFixture<SiloPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiloPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiloPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
