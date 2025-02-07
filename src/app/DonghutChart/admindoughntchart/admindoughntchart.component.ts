import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admindoughntchart',
  templateUrl: './admindoughntchart.component.html',
  styleUrls: ['./admindoughntchart.component.css']
})
export class AdmindoughntchartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  notifSrc: string = 'assets/image/E6.png';
  mailSrc: string = 'assets/image/E7.png';

  data: any;

  options: any;

  ngAfterViewInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['Used Credits 60%', 'Remaining Credits 40%'],
      datasets: [
        {
          data: [60, 40],
          backgroundColor: ['rgba(255, 86, 95, 0.8)', 'rgba(255, 186, 190, 1)'],
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
