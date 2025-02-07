import { TestBed } from '@angular/core/testing';

import { ScanReportService } from './scan-report.service';

describe('ScanReportService', () => {
  let service: ScanReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScanReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
