import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofreadingDetailsComponent } from './proofreading-details.component';

describe('ProofreadingDetailsComponent', () => {
  let component: ProofreadingDetailsComponent;
  let fixture: ComponentFixture<ProofreadingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProofreadingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofreadingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
