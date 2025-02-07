import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  ngOnInit(): void {}

  backgroundImage = 'url(assets/image/login1.png)';
  logoImage = 'url(assets/image/header1.png)';

  email: string = '';

  isLoading: boolean = false;

  baseUrl: string = environment.production;
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  showPassword = false;
  newPassword: string = '';
  token: string = '';
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  resetPassword() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    console.log(this.token, 'token data');
    this.isLoading = true;
    this.http
      .post(`${this.baseUrl}/api/resetPassword/${this.token}`, {
        newPassword: this.newPassword,
      })
      .subscribe({
        next: (res) => {
          // this.router.navigate(['/signin']);
          this.toastr.success('Password reset successfully.');
          this.newPassword = '';
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
