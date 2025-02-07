import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGoogleCalenderComponent } from './user-google-calender.component';

describe('UserGoogleCalenderComponent', () => {
  let component: UserGoogleCalenderComponent;
  let fixture: ComponentFixture<UserGoogleCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGoogleCalenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGoogleCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
