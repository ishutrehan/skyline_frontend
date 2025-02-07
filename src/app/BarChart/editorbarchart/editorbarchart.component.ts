import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editorbarchart',
  templateUrl: './editorbarchart.component.html',
  styleUrls: ['./editorbarchart.component.css']
})
export class EditorbarchartComponent implements OnInit {

  data: any;

  options: any;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: [
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
          ], // Use Tailwind CSS color classes directly
          data: [100, 95, 80, 60, 63, 23],
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
}
