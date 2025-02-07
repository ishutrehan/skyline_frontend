import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProofreadingDetailsComponent } from './show-proofreading-details.component';

describe('ShowProofreadingDetailsComponent', () => {
  let component: ShowProofreadingDetailsComponent;
  let fixture: ComponentFixture<ShowProofreadingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowProofreadingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowProofreadingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
