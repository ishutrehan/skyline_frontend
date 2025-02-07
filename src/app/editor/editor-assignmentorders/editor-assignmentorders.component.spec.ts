import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorAssignmentordersComponent } from './editor-assignmentorders.component';

describe('EditorAssignmentordersComponent', () => {
  let component: EditorAssignmentordersComponent;
  let fixture: ComponentFixture<EditorAssignmentordersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorAssignmentordersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorAssignmentordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
