import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAcademicToolkitComponent } from './user-academic-toolkit.component';

describe('UserAcademicToolkitComponent', () => {
  let component: UserAcademicToolkitComponent;
  let fixture: ComponentFixture<UserAcademicToolkitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAcademicToolkitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAcademicToolkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
