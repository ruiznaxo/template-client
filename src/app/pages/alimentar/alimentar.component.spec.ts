import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlimentarComponent } from './alimentar.component';

describe('AlimentarComponent', () => {
  let component: AlimentarComponent;
  let fixture: ComponentFixture<AlimentarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlimentarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlimentarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
