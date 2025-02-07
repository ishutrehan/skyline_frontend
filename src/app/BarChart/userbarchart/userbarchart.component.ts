import { Component, OnInit } from '@angular/core';
import { UserDashboardChartServiceService } from 'src/app/services/user-dashboard-chart-service.service';

@Component({
  selector: 'app-userbarchart',
  templateUrl: './userbarchart.component.html',
  styleUrls: ['./userbarchart.component.css'],
})
export class UserbarchartComponent implements OnInit {
  constructor(private proofReadingChar: UserDashboardChartServiceService) {}

  data: any;
  data1: any[] = [];

  options: any;
  labelsData: any[] = [];
  handleProofReadingData() {
    this.proofReadingChar.proofReadingEditingChart().subscribe((res: any) => {
      console.log(res, 'res are');
      this.labelsData = res.yearlyData.map((data: any) => {
        return data.month;
      });
      this.data1 = res.yearlyData.map((data: any) => {
        return data.submission_count;
      });
      this.funChart(this.data1);
    });
  }
  handleAssignmentData() {
    this.proofReadingChar.assignmentChart().subscribe((res: any) => {
      this.labelsData = res.yearlyData.map((data: any) => {
        return data.month;
      });
      this.data1 = res.yearlyData.map((data: any) => {
        return data.submission_count;
      });
      this.funChart(this.data1);
    });
  }

  ngOnInit(): void {
    this.handleProofReadingData();
  }
  funChart(chartData: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: this.labelsData,
      datasets: [
        {
          label: 'Data',
          backgroundColor: [
            'rgba(239, 68, 68, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(239, 68, 68, 1)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)',
            'rgb(255, 99, 132)',
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)',
            'rgb(255, 99, 132)',
          ], // Use Tailwind CSS color classes directly
          data: chartData,
          borderWidth: 1,
          barThickness: 8,
          barPercentage: 10,
          categoryPercentage: 10,
          barRadius: 10, // Adjust the radius as needed
          borderRadius: 10,
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 20, // Set the interval between ticks
            font: {
              size: 14, // Set the font size for the tick labels
            },
          },
        },
        x: {
          ticks: {
            font: {
              size: 12, // Set the font size for the x-axis labels
            },
          },
        },
      },
    };
  }

  isButtonActivated: number | null = 1;
  
  toggleButton(buttonNumber: number) {
    if (this.isButtonActivated === buttonNumber) {
      this.isButtonActivated = null;
    } else {
      this.isButtonActivated = buttonNumber;
    }
  }
}
