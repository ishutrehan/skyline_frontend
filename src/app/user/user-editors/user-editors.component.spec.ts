import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditorsComponent } from './user-editors.component';

describe('UserEditorsComponent', () => {
  let component: UserEditorsComponent;
  let fixture: ComponentFixture<UserEditorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserEditorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
