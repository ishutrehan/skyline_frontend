import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  profileImageUrl: string =
    'https://media.istockphoto.com/id/1435566677/vector/placeholder-icon-illustration.jpg?s=612x612&w=0&k=20&c=mMfFWN3fGUOv5S75bC5tmMSzFDNoqiCQFfVoMTsC4n0=';
  username: string = '';
  useremail: string = '';
  userId: number = 0;
  UploadedprofileImage: string = '';
  baseUrl: string = environment.production;
  data: any = {
    myid: '',
    firstname: '',
    lastname: '',
    password: '',
    confirmPass: '',
    interest: '',
    city: '',
    email: '',
    expertise: '',
    bio: '',
    profileImg: '',
  };
  submitted: boolean = false;

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url === '/' + path;
  }

  redirectToDashboard(): void {
    let userInfo: any = localStorage.getItem('userInfo');
    userInfo = JSON.parse(userInfo);
    const accountType = userInfo.accountType;
    switch (accountType) {
      case 'user':
        this.navigateTo('user/dashboard');
        break;
      case 'admin':
        this.navigateTo('admin/dashboard');
        break;
      case 'editor':
        this.navigateTo('editor/dashboard');
        break;
      default:
        console.error('Unknown account type');
    }
  }

  ngOnInit(): void {
    const userinfo = localStorage.getItem('userInfo');
    if (userinfo) {
      const newdata = JSON.parse(userinfo);
      this.username = newdata.name.split(' ');
      this.useremail = newdata.email;
      this.userId = newdata.userId;
      if (newdata.profileImg) {
        this.profileImageUrl = this.baseUrl + '/' + newdata.profileImg;
      }
      this.data = {
        myid: newdata.userId,
        firstname: this.username[0],
        lastname: newdata.lastname,
        interest: newdata.interest,
        password:'',
        confirmPass: '',
        city: newdata.city,
        email: this.useremail,
        expertise: newdata.expertise,
        bio: newdata?.bio,
      };
    }
    this.submitted = false;
  }
  // 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60';

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit() {
    this.submitted = true;
    if ((
      (this.data.password && this.data.confirmPass) ||
      (!this.data.confirmPass && !this.data.password))&& (this.data.password === this.data.confirmPass)
    ) {
      const datatosend = new FormData();
      if (this.data.password ) {
        datatosend.append('password', this.data.password);
        datatosend.append('name', this.data.firstname);
        datatosend.append('lastname', this.data.lastname);
        datatosend.append('myid', this.data.myid);
        datatosend.append('interest', this.data.interest);
        datatosend.append('city', this.data.city);
        datatosend.append('email', this.data.email);
        datatosend.append('expertise', this.data.expertise);
        datatosend.append('bio', this.data.bio);
      } else {
        datatosend.append('name', this.data.firstname);
        datatosend.append('lastname', this.data.lastname);
        datatosend.append('myid', this.data.myid);
        datatosend.append('interest', this.data.interest);
        datatosend.append('city', this.data.city);
        datatosend.append('email', this.data.email);
        datatosend.append('expertise', this.data.expertise);
        datatosend.append('bio', this.data.bio);
      }

      this.http
        .put<any>(`${this.baseUrl}/api/updateProfile`, datatosend)
        .subscribe({
          next: (response: any) => {
            this.toastr.success('profile Updated successfully');
            this.getUser();
          },

          error: (error: any) => {
            this.toastr.error(error);
          },
        });
    }
    else{
      this.toastr.warning("password and confirm password doesn't match");
    }
  }

  getUser() {
    const id = this.userId;
    if (id) {
      this.http.get<any>(`${this.baseUrl}/api/user/${id}`).subscribe({
        next: (response: any) => {
          if (localStorage.getItem('userInfo')) {
            localStorage.removeItem('userInfo');
            localStorage.setItem(
              'userInfo',
              JSON.stringify(response.userDetails[0])
            );
          } else {
            localStorage.setItem(
              'userInfo',
              JSON.stringify(response.userDetails[0])
            );
          }
        },
        error: (error: any) => {
          this.toastr.error(error);
        },
      });
    }
  }

  handleChangeImage(event: any) {
    if (event.target.files[0]) {
      this.UploadedprofileImage = event.target.files[0];
    }
    const datatosend = new FormData();
    if (this.UploadedprofileImage) {
      datatosend.append('file', this.UploadedprofileImage);
      datatosend.append('myid', this.data.myid);
      this.http
        .put<any>(`${this.baseUrl}/api/updateImage`, datatosend)
        .subscribe({
          next: (response: any) => {
            this.toastr.success('profile Updated successfully');
            this.getUser();
          },

          error: (error: any) => {
            this.toastr.error(error);
          },
        });
    } else {
      this.toastr.error('choose file first');
    }
  }
}
