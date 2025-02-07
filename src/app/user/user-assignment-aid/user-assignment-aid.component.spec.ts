import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAssignmentAidComponent } from './user-assignment-aid.component';

describe('UserAssignmentAidComponent', () => {
  let component: UserAssignmentAidComponent;
  let fixture: ComponentFixture<UserAssignmentAidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAssignmentAidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAssignmentAidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
