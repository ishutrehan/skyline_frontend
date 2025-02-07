import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAssignmentFeedbackComponent } from './admin-assignment-feedback.component';

describe('AdminAssignmentFeedbackComponent', () => {
  let component: AdminAssignmentFeedbackComponent;
  let fixture: ComponentFixture<AdminAssignmentFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAssignmentFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAssignmentFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
