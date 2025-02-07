import { TestBed } from '@angular/core/testing';

import { EditorDashboardService } from './editor-dashboard.service';

describe('EditorDashboardService', () => {
  let service: EditorDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
