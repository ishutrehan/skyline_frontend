import { TestBed } from '@angular/core/testing';

import { FinancialReportDashboardService } from './financial-report-dashboard.service';

describe('FinancialReportDashboardService', () => {
  let service: FinancialReportDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialReportDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
