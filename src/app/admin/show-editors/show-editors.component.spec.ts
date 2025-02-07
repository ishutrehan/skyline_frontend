import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEditorsComponent } from './show-editors.component';

describe('ShowEditorsComponent', () => {
  let component: ShowEditorsComponent;
  let fixture: ComponentFixture<ShowEditorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowEditorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowEditorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
