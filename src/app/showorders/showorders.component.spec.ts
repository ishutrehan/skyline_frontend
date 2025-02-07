import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowordersComponent } from './showorders.component';

describe('ShowordersComponent', () => {
  let component: ShowordersComponent;
  let fixture: ComponentFixture<ShowordersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowordersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
