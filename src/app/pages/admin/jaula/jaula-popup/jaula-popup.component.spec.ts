import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JaulaPopupComponent } from './jaula-popup.component';

describe('JaulaPopupComponent', () => {
  let component: JaulaPopupComponent;
  let fixture: ComponentFixture<JaulaPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JaulaPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JaulaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
