import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { AuthService } from '../firebaseConfig/services/auth.services';
import { take, filter, using } from 'rxjs';
import { RecaptchaService } from '../services/recaptcha.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  user: any;
  siteKey = '6Ld4A5UqAAAAALxjmlMVwQQpJ81osTMGdQhCNjwT';

  ngOnInit() {}
  isLoading: boolean = false;
  backgroundImage = 'url(assets/image/login1.png)';
  logoImage = 'url(assets/image/header1.png)';
  formData: any = {
    name: '',
    email: '',
    academicLevel: '',
    interest: '',
    password: '',
  };
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    public authService: AuthService,
    private recaptchaService: RecaptchaService
  ) {}
  baseUrl: string = environment.production;
  response: any;

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

  async onSubmit() {
    this.isLoading = true;
    // Destructure the formData object for easier access
    const { name, email, academicLevel, interest, password } = this.formData;

    // Check if any field is empty
    if (!name || !email || !password) {
      this.toastr.warning('Please Enter all the fields');
      this.isLoading = false;
      return;
    }
    if (password.length < 8) {
      console.log();
      this.toastr.warning('Password must contain 8 letter or more');
      this.isLoading = false;
      return;
    }

    this.response = await this.verifyRecaptcha();
    console.log(this.response, 'let see the result');

    if (this.response.success || this.response.score >= 0.5) {
      console.log(this.formData, 'res is');
      this.http
        .post<any>(`${this.baseUrl}/api/signup`, {
          name,
          email,
          academicLevel,
          interest,
          pass: password,
        })
        .subscribe({
          next: (res) => {
            if (res.message !== 'duplicate email id') {
              this.authService.SignUp(email, password).then(() => {
                this.authService.userData$.subscribe((userData) => {
                  this.user = userData;
                  console.log('User data for sinmple signup: ', this.user);
                });
              });
            }
            this.isLoading = false;

            this.router.navigate(['/signin']);
            this.toastr.success(res.message || res.error.message);
          },
          error: (err) => {
            this.isLoading = false;
            this.toastr.error(err.error.message);
            console.log(err);
          },
        });

      this.formData.name = '';
      this.formData.email = '';
      this.formData.password = '';
    }
    else{
      this.isLoading = false;
      this.toastr.warning('Suspicious activity detected');
      return;
    }
  }

  //uid,email stored in database
  async signupData(uid: any, email: any, displayName: any) {
    console.log(uid, email, 'uid and email');
    this.http
      .post<any>(`${this.baseUrl}/api/signup`, {
        name: displayName,
        email,
        pass: uid,
      })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.toastr.success(res.message);
        },
        error: (err) => {
          this.toastr.error(err.error.message);
          console.log(err, 'error whhile signup');
        },
      });
  }

  async googleSignup() {
    try {
      this.isLoading = true;
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
            await this.signupData(
              this.user.uid,
              this.user.email,
              this.user.displayName
            );
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

  async facebookSignup() {
    try {
      this.isLoading = true;
      await this.authService.FacebookAuth();

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
              'User data after facebook signup'
            );
            await this.signupData(
              this.user.uid,
              this.user.email,
              this.user.displayName
            );
          } else {
            console.error('User data is null after Google signup');
            this.toastr.error('facebook signup failed: No user data');
          }
        });
    } catch (error) {
      console.error('facebook signup failed:', error);
      this.toastr.error('facebook signup failed');
    }
  }
  show: boolean = false;

  togglePasswordVisibility(): void {
    this.show = !this.show;
  }
}
