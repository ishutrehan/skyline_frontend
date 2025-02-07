import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofreadingEditordetailsComponent } from './proofreading-editordetails.component';

describe('ProofreadingEditordetailsComponent', () => {
  let component: ProofreadingEditordetailsComponent;
  let fixture: ComponentFixture<ProofreadingEditordetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProofreadingEditordetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofreadingEditordetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
