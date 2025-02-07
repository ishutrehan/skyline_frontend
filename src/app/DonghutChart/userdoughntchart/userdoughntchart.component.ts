import { Component, OnInit } from '@angular/core';
import { SubscriptionDetailsService } from 'src/app/services/subscription-details.service';

@Component({
  selector: 'app-userdoughntchart',
  templateUrl: './userdoughntchart.component.html',
  styleUrls: ['./userdoughntchart.component.css']
})
export class UserdoughntchartComponent implements OnInit {

  constructor(private subscriptionDetails:SubscriptionDetailsService) { }

  creditUsed:number=0;
  creditRemaining:number=0;
  startDate:any=''
  ngOnInit(): void {
       this.subscriptionDetails.getRunningSubPlan().subscribe((res:any)=>{
       this.creditRemaining = res.credit
       this.creditUsed = 100 - res.credit
       const dateData= new Date (res.startDate)
       const options:any = { year: 'numeric', month: 'long', day: 'numeric' };
       this.startDate = new Intl.DateTimeFormat('en-GB', options).format(dateData);
       this.fun()
       })
  }
  notifSrc: string = 'assets/image/E6.png';
  mailSrc: string = 'assets/image/E7.png';

  data: any;

  options: any;

  fun() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: [`Used Credits ${this.creditUsed}`, `Remaining Credits ${this.creditRemaining}`],
      datasets: [
        {
          data: [this.creditUsed, this.creditRemaining],
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
