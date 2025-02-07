import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorAssignmentClarityComponent } from './editor-assignment-clarity.component';

describe('EditorAssignmentClarityComponent', () => {
  let component: EditorAssignmentClarityComponent;
  let fixture: ComponentFixture<EditorAssignmentClarityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorAssignmentClarityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorAssignmentClarityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
