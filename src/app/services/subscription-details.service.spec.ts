import { TestBed } from '@angular/core/testing';

import { SubscriptionDetailsService } from './subscription-details.service';

describe('SubscriptionDetailsService', () => {
  let service: SubscriptionDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
