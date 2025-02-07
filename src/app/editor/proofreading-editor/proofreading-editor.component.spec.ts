import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofreadingEditorComponent } from './proofreading-editor.component';

describe('ProofreadingEditorComponent', () => {
  let component: ProofreadingEditorComponent;
  let fixture: ComponentFixture<ProofreadingEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProofreadingEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofreadingEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
