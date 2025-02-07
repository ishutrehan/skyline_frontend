import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCompletionComponent } from './order-completion.component';

describe('OrderCompletionComponent', () => {
  let component: OrderCompletionComponent;
  let fixture: ComponentFixture<OrderCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderCompletionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
