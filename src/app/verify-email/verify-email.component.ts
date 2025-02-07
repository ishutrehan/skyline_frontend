import { Component, OnInit } from '@angular/core';
import { AuthService } from '../firebaseConfig/services/auth.services';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  constructor(public authService: AuthService) {}

  ngOnInit() {}

}
