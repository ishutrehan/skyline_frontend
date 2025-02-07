import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../..//environments/environment';
import { AuthService } from '../firebaseConfig/services/auth.services';
import { filter, take } from 'rxjs';
import { RecaptchaService } from '../services/recaptcha.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  ngOnInit(): void {}

  backgroundImage = 'url(assets/image/login1.png)';
  logoImage = 'url(assets/image/header1.png)';

  email: string = '';
  password: string = '';
  accountType: string = '';
  isLoading: boolean = false;
  show: boolean = false;
  captchadata: any = {};

  togglePasswordVisibility(): void {
    this.show = !this.show;
  }
  baseUrl: string = environment.production;
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    public authService: AuthService,
    private recaptchaService: RecaptchaService
  ) {}

  verifyRecaptcha(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.recaptchaService
        .executeRecaptcha('homepage')
        .then((token) => {
          console.log('reCAPTCHA Token:', token);

          // Send the token to the backend for verification
          this.http
            .post(`${this.baseUrl}/api/verifyRecaptcha`, { token })
            .subscribe({
              next: (response) => {
                console.log('Verification response:', response);
                resolve(response); // Resolve the promise with the response
              },
              error: (err) => {
                console.error('Verification error:', err);
                reject(err); // Reject the promise with the error
              },
            });
        })
        .catch((error) => {
          console.error('reCAPTCHA error:', error);
          reject(error); // Reject the promise if reCAPTCHA fails
        });
    });
  }

  response: any;
  async login() {
    this.isLoading = true;
    if (!this.email || !this.password) {
      this.isLoading = false;
      this.toastr.warning('Email Id or Password is missing.');
      return;
    }
     this.response= await this.verifyRecaptcha();
    console.log(this.response,'let see the result')
    if (this.response.success || this.response.score >= 0.5)
    {
    this.http
      .post<any>(`${this.baseUrl}/api/login`, {
        email: this.email,
        pass: this.password,
      })
      .subscribe({
        next: async (res: any) => {
          await this.authService.SignIn(this.email, this.password);
          this.accountType = res?.user[0]?.accountType;
          if (this.accountType == 'admin') {
            localStorage.setItem(
              'userInfo',
              JSON.stringify({
                userId: res?.user[0]?.userId,
                email: res?.user[0]?.email,
                name: res?.user[0]?.name,
                accountType: res?.user[0]?.accountType,
                profileImg: res?.user[0]?.profileImg,
                bio: res?.user[0]?.bio,
                lastname: res?.user[0]?.lastname,
                city: res?.user[0]?.city,
                expertise: res?.user[0]?.expertise,
                interest: res?.user[0]?.interest,
                pass: res?.user[0].pass,
              })
            );
            sessionStorage.setItem(
              'userInfo',
              JSON.stringify({
                userId: res?.user[0]?.userId,
                email: res?.user[0]?.email,
                name: res?.user[0]?.name,
                accountType: res?.user[0]?.accountType,
                profileImg: res?.user[0]?.profileImg,
                bio: res?.user[0]?.bio,
                lastname: res?.user[0]?.lastname,
                city: res?.user[0]?.city,
                expertise: res?.user[0]?.expertise,
                interest: res?.user[0]?.interest,
              })
            );
          } else {
            localStorage.setItem(
              'userInfo',
              JSON.stringify({
                userId: res?.user[0]?.userId,
                email: res?.user[0]?.email,
                name: res?.user[0]?.name,
                accountType: res?.user[0]?.accountType,
                profileImg: res?.user[0]?.profileImg,
                bio: res?.user[0]?.bio,
                lastname: res?.user[0]?.lastname,
                city: res?.user[0]?.city,
                expertise: res?.user[0]?.expertise,
                interest: res?.user[0]?.interest,
              })
            );
            sessionStorage.setItem(
              'userInfo',
              JSON.stringify({
                userId: res?.user[0]?.userId,
                email: res?.user[0]?.email,
                name: res?.user[0]?.name,
                accountType: res?.user[0]?.accountType,
                profileImg: res?.user[0]?.profileImg,
                bio: res?.user[0]?.bio,
                lastname: res?.user[0]?.lastname,
                city: res?.user[0]?.city,
                expertise: res?.user[0]?.expertise,
                interest: res?.user[0]?.interest,
              })
            );
          }

          this.isLoading = false;
          this.toastr.success('login successfully');
          this.router.navigate([`${this.accountType}/dashboard`]);
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error('Email Id or Password incorrect');
        },
      });

    this.email = '';
    this.password = '';
    }
    else{
      this.isLoading=false
      this.toastr.warning('Suspicious activity detected');
      return;
    }
  }

  signinData(password: any, email: any) {
    if (!email || !password) {
      this.isLoading = false;
      this.toastr.warning('Email Id or Password is missing.');
      return;
    }
    this.http
      .post<any>(`${this.baseUrl}/api/login`, {
        email: email,
        pass: password,
      })
      .subscribe({
        next: async (res: any) => {
          console.log(' after login ya data ata hai user ka ', res);
          this.accountType = res?.user[0]?.accountType;
          localStorage.setItem(
            'userInfo',
            JSON.stringify({
              userId: res?.user[0]?.userId,
              email: res?.user[0]?.email,
              name: res?.user[0]?.name,
              accountType: res?.user[0]?.accountType,
              profileImg: res?.user[0]?.profileImg,
              bio: res?.user[0]?.bio,
              lastname: res?.user[0]?.lastname,
              city: res?.user[0]?.city,
              expertise: res?.user[0]?.expertise,
              interest: res?.user[0]?.interest,
            })
          );
          // this.isLoading = false;
          // this.toastr.success('login successfully');
          this.router.navigate([`${this.accountType}/dashboard`]);
        },
        error: (err) => {
          this.toastr.error('Email Id or Password incorrect');
        },
      });
  }
  user: any;
  async loginWithGoogle() {
    try {
      await this.authService.GoogleAuth();

      // Subscribe to the userData$ observable and handle the user data
      this.authService.userData$
        .pipe(
          filter((userData) => userData !== null), // Filter out null values
          take(1) // Take only the first valid (non-null) emission
        )
        .subscribe(async (userData) => {
          if (userData) {
            // Check if userData is not null
            this.user = userData;
            console.log(
              this.user.uid,
              this.user.email,
              'User data after Google signup'
            );
            await this.signinData(this.user.uid, this.user.email);
          } else {
            console.error('User data is null after Google signup');
            this.toastr.error('Google signup failed: No user data');
          }
        });
    } catch (error) {
      console.error('Google signup failed:', error);
      this.toastr.error('Google signup failed');
    }
  }
  loginWithFacebook() {
    console.log('login with facebook');
  }
}
