import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminbarchartComponent } from './adminbarchart.component';

describe('AdminbarchartComponent', () => {
  let component: AdminbarchartComponent;
  let fixture: ComponentFixture<AdminbarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminbarchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminbarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
