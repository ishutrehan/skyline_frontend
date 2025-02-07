import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.css'],
})
export class SubscriptionDetailsComponent implements OnInit {
  ngOnInit(): void {
    this.currentSubscriptionPlan();
    this.paymentcheck= false
  }
  userDetails: any = localStorage.getItem('userInfo');
  userInfo = JSON.parse(this.userDetails);
  avatarAlt: string = 'Avatar';
  paymentcheck: boolean = false;
  cs0Src: string = 'assets/image/arrow-left.png';
  cs1Src: string = 'assets/image/tick-circle.png';

  Basic: Boolean = false;
  Advance: Boolean = false;
  Premium: Boolean = false;
  subscripitionDetails = {
    id: '',
    subscripitionType: '',
    amount: 0,
  };
  subId: Number = 0;
  subscriptionTypes = [
    {
      id: 1,
      amount: 5,
      planDescription: 'Basic',
    },
    {
      id: 2,
      amount: 10,
      planDescription: 'Premium',
    },
    {
      id: 3,
      amount: 15,
      planDescription: 'Advance',
    },
  ];
  constructor(private http: HttpClient, private router: Router) {}

  amount!: Number;
  runningPlanType: string = '';
  baseUrl: string = environment.production;
  planType: String = '';
  currentPlan!: any;

  async getStart(abcd: Number) {
    this.subId = abcd;
    await this.checkoutSubscription();
    console.log(abcd, 'abcd');
    this.paymentcheck = false;
  }

  async updatePlan(abcdId: Number) {
    console.log('update plan');
    this.subId = abcdId;
    const subDetails = this.subscriptionTypes.find(
      (data: any) => data.id === abcdId
    );
    console.log('hi');
    await this.checkoutSubscription();
    if (this.paymentcheck)
      this.http
        .put(`${this.baseUrl}/api/update-subscription-plan`, {
          userId: this.userInfo.userId,
          amount: subDetails?.amount,
          planDescription: subDetails?.planDescription,
        })
        .subscribe((res: any) => {
          console.log(res, 'response');
          this.currentSubscriptionPlan();
          this.paymentcheck = false;
        });
  }
  currentSubscriptionPlan() {
    this.http
      .get(
        `${this.baseUrl}/api/check-subscription-plan/${this.userInfo.userId}`
      )
      .subscribe({
        next: (data: any) => {
          this.amount = data.amount;
          this.runningPlanType = data.planType;
          console.log(data.amount, 'data is ');
          this.currentPlan = this.subscriptionTypes.find(
            (data, index) => data.amount === this.amount
          );
          console.log(this.currentPlan, 'current plan is ');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  checkoutSubscription() {
    // const userId = localStorage.getItem('user');
    // console.log(userId,"sdkskdk");
    const subDetails = this.subscriptionTypes.find(
      (data: any) => data.id === this.subId
    );
    this.http
      .post(`${this.baseUrl}/api/create-checkout-subscription`, {
        amount: subDetails?.amount,
        planDescription: subDetails?.planDescription,
        email: this.userInfo?.email,
        userId: this.userInfo?.userId,
      })
      .subscribe((res: any) => {
        if (res.value) {
          this.paymentcheck = true;
        }
        JSON.stringify(
          sessionStorage.setItem('sessionId', res.checkoutSession.id)
        );
        window.open(res.checkoutSession.url, '_blank');
        console.log(res, 'res are');
      });

    console.log(subDetails, 'subDetails');
  }
}
