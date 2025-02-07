import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-data-anylsis-pricing',
  templateUrl: './user-data-anylsis-pricing.component.html',
  styleUrls: ['./user-data-anylsis-pricing.component.css']
})
export class UserDataAnylsisPricingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  avatarAlt: string = 'Avatar';
  cs0Src: string = 'assets/image/arrow-left.png';
  cs1Src: string = 'assets/image/tick-circle.png';

}
