import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMyscanComponent } from './user-myscan.component';

describe('UserMyscanComponent', () => {
  let component: UserMyscanComponent;
  let fixture: ComponentFixture<UserMyscanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMyscanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMyscanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
