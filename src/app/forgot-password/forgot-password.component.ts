import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AuthService } from '../firebaseConfig/services/auth.services';
import { RecaptchaService } from '../services/recaptcha.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  ngOnInit(): void {}

  backgroundImage = 'url(assets/image/login1.png)';
  logoImage = 'url(assets/image/header1.png)';

  email: string = '';

  isLoading: boolean = false;

  baseUrl: string = environment.production;
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  resetPassword() {
    this.isLoading = true;
    console.log(this.email, 'forgot');
    this.http
      .post(`${this.baseUrl}/api/forgotPassword`, { email: this.email })
      .subscribe({
        next: (res) => {
          // this.router.navigate(['/signin']);
          this.toastr.success('Password reset email sent successfully.');
          this.email = '';
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error(err.error.message);
          console.log(err);
        },
      });
  }
}
