import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAssignmentClarityComponent } from './admin-assignment-clarity.component';

describe('AdminAssignmentClarityComponent', () => {
  let component: AdminAssignmentClarityComponent;
  let fixture: ComponentFixture<AdminAssignmentClarityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAssignmentClarityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAssignmentClarityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
