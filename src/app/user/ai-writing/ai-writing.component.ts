import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ai-writing',
  templateUrl: './ai-writing.component.html',
  styleUrls: ['./ai-writing.component.css']
})
export class AiWritingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  avatarAlt: string = 'Avatar';
  cs0Src: string = 'assets/image/arrow-left.png';
  cs1Src: string = 'assets/image/tick-circle.png';

}
