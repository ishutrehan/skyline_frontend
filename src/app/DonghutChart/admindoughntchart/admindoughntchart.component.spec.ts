import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmindoughntchartComponent } from './admindoughntchart.component';

describe('AdmindoughntchartComponent', () => {
  let component: AdmindoughntchartComponent;
  let fixture: ComponentFixture<AdmindoughntchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmindoughntchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmindoughntchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
