import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentFeedbackDetailsComponent } from './assignment-feedback-details.component';

describe('AssignmentFeedbackDetailsComponent', () => {
  let component: AssignmentFeedbackDetailsComponent;
  let fixture: ComponentFixture<AssignmentFeedbackDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentFeedbackDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentFeedbackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
