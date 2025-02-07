import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Admin1doughntchartComponent } from './admin1doughntchart.component';

describe('Admin1doughntchartComponent', () => {
  let component: Admin1doughntchartComponent;
  let fixture: ComponentFixture<Admin1doughntchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Admin1doughntchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Admin1doughntchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
