import { TestBed } from '@angular/core/testing';

import { AdminDashboardChartService } from './admin-dashboard-chart.service';

describe('AdminDashboardChartService', () => {
  let service: AdminDashboardChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminDashboardChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
