import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-assignment-aid',
  templateUrl: './user-assignment-aid.component.html',
  styleUrls: ['./user-assignment-aid.component.css']
})
export class UserAssignmentAidComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  avatarAlt: string = 'Avatar';
  ass1Src: string = 'assets/image/ass1.png';
  ass2Src: string = 'assets/image/ass2.png';
  ass3Src: string = 'assets/image/ass3.png';
}
