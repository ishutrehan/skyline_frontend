import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDataAnalysisComponent } from './user-data-analysis.component';

describe('UserDataAnalysisComponent', () => {
  let component: UserDataAnalysisComponent;
  let fixture: ComponentFixture<UserDataAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDataAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDataAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
