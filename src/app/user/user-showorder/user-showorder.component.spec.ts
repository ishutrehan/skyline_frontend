import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserShoworderComponent } from './user-showorder.component';

describe('UserShoworderComponent', () => {
  let component: UserShoworderComponent;
  let fixture: ComponentFixture<UserShoworderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserShoworderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserShoworderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
