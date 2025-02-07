import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-fail',
  templateUrl: './payment-fail.component.html',
  styleUrls: ['./payment-fail.component.css']
})
export class PaymentFailComponent implements OnInit {
  cancelpay : string = 'assets/image/prohibition.png'

  constructor() { }

  ngOnInit(): void {
  }

}
