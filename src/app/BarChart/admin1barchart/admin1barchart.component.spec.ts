import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Admin1barchartComponent } from './admin1barchart.component';

describe('Admin1barchartComponent', () => {
  let component: Admin1barchartComponent;
  let fixture: ComponentFixture<Admin1barchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Admin1barchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Admin1barchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
