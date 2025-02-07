import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserbarchartComponent } from './userbarchart.component';

describe('UserbarchartComponent', () => {
  let component: UserbarchartComponent;
  let fixture: ComponentFixture<UserbarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserbarchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserbarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
