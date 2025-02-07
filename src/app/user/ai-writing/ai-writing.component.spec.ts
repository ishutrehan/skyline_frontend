import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiWritingComponent } from './ai-writing.component';

describe('AiWritingComponent', () => {
  let component: AiWritingComponent;
  let fixture: ComponentFixture<AiWritingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiWritingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiWritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
