import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdoughntchartComponent } from './userdoughntchart.component';

describe('UserdoughntchartComponent', () => {
  let component: UserdoughntchartComponent;
  let fixture: ComponentFixture<UserdoughntchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserdoughntchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserdoughntchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
