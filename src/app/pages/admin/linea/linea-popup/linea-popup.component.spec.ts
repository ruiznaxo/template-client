import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaPopupComponent } from './linea-popup.component';

describe('LineaPopupComponent', () => {
  let component: LineaPopupComponent;
  let fixture: ComponentFixture<LineaPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineaPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
