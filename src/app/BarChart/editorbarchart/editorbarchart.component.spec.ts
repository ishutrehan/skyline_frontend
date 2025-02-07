import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorbarchartComponent } from './editorbarchart.component';

describe('EditorbarchartComponent', () => {
  let component: EditorbarchartComponent;
  let fixture: ComponentFixture<EditorbarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorbarchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorbarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
