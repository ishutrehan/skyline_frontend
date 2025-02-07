import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAssignmentorderComponent } from './show-assignmentorder.component';

describe('ShowAssignmentorderComponent', () => {
  let component: ShowAssignmentorderComponent;
  let fixture: ComponentFixture<ShowAssignmentorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAssignmentorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAssignmentorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
