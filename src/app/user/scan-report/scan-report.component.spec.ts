import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanReportComponent } from './scan-report.component';

describe('ScanReportComponent', () => {
  let component: ScanReportComponent;
  let fixture: ComponentFixture<ScanReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
