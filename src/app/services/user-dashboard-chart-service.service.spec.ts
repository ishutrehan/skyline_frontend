import { TestBed } from '@angular/core/testing';

import { UserDashboardChartServiceService } from './user-dashboard-chart-service.service';

describe('UserDashboardChartServiceService', () => {
  let service: UserDashboardChartServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDashboardChartServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
