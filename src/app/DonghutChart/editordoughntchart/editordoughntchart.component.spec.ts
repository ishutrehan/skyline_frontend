import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditordoughntchartComponent } from './editordoughntchart.component';

describe('EditordoughntchartComponent', () => {
  let component: EditordoughntchartComponent;
  let fixture: ComponentFixture<EditordoughntchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditordoughntchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditordoughntchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
