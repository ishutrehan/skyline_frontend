import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMyorderdetailsComponent } from './user-myorderdetails.component';

describe('UserMyorderdetailsComponent', () => {
  let component: UserMyorderdetailsComponent;
  let fixture: ComponentFixture<UserMyorderdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMyorderdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMyorderdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
