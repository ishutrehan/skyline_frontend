import { Component, OnInit } from '@angular/core';
import { FinancialReportDashboardService } from 'src/app/services/financial-report-dashboard.service';

@Component({
  selector: 'app-admin1doughntchart',
  templateUrl: './admin1doughntchart.component.html',
  styleUrls: ['./admin1doughntchart.component.css'],
})
export class Admin1doughntchartComponent implements OnInit {
  constructor(private annualReport: FinancialReportDashboardService) {}

  ngOnInit(): void {
    this.annualReportData();
  }
  notifSrc: string = 'assets/image/E6.png';
  mailSrc: string = 'assets/image/E7.png';

  data: any;
  options: any;

  labelData: any[] = [];
  dataVal: any[] = [];
  annualReportData() {
    this.annualReport.annualRevenue().subscribe((res: any) => {
      res.annualFinancialReport.forEach((data: any) => {
        this.labelData.push(data.year);
        this.dataVal.push(data.yearly_revenue);
      });
      this.dataReadForChart();
      console.log(res, 'res are');
    });
  }
  dataReadForChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: this.labelData,
      datasets: [
        {
          data: this.dataVal,
          backgroundColor: [
            '#fecaca',
            '#fca5a5',
            '#f87171',
            '#ef4444',
            '#dc2626',
          ],
        },
      ],
    };

    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          display: false,
        },
        labels: {
          color: textColor,
        },
      },
    };
  }
}
