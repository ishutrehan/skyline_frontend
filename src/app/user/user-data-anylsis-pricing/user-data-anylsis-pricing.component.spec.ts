import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDataAnylsisPricingComponent } from './user-data-anylsis-pricing.component';

describe('UserDataAnylsisPricingComponent', () => {
  let component: UserDataAnylsisPricingComponent;
  let fixture: ComponentFixture<UserDataAnylsisPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDataAnylsisPricingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDataAnylsisPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
