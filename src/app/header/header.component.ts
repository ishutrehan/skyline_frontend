import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import { timeInterval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../firebaseConfig/services/auth.services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  baseUrl: any = environment.production;
  unreadMsg:number= 0;
  userImage:string = ''
  accessBy:string = ''
  adminPass:string = ''
  adminEmail:string = ''

  ngOnInit(): void {
    this.getNotifications();
    this.getUnReadNotifications()
    let userInfo: any = localStorage.getItem('userInfo');
    userInfo = JSON.parse(userInfo);
    this.accountType = userInfo?.accountType || ''; // Ensure accountType is set correctly
    this.accessBy = userInfo?.accessBy || ''; // Ensure accountType is set correctly
    this.adminEmail = userInfo?.adminEmail || ''; // Ensure accountType is set correctly
    this.adminPass = userInfo?.adminPass || ''; // Ensure accountType is set correctly
    if(userInfo.profileImg){
      this.userImage = this.baseUrl+'/'+userInfo?.profileImg
    }
    console.log(this.accountType, 'accountType in HeaderComponent');
  }
  avatarAlt: string = 'Avatar';
  avatarSrc: string = 'assets/image/header1.png';
  searchAlt: string = 'Search Icon';
  searchSrc: string = 'assets/image/search.png';
  headerAlt: string = 'Header Icon';
  headerSrc: string ='https://media.istockphoto.com/id/1435566677/vector/placeholder-icon-illustration.jpg?s=612x612&w=0&k=20&c=mMfFWN3fGUOv5S75bC5tmMSzFDNoqiCQFfVoMTsC4n0='

  notifAlt: string = 'Notification Icon';
  notifSrc: string = 'assets/image/notification.png';
  mailAlt: string = 'Mail Icon';
  mailSrc: string =
    'assets/image/png-transparent-icon-email-email-miscellaneous-angle-text-thumbnail.png';
  s3Src: string = 'assets/image/svl.png';
  // userInfo =
  accountType: string = '';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient,
    public authService: AuthService

  ) {}
  userDetails: any = localStorage.getItem('userInfo');
  userInfo: any = JSON.parse(this.userDetails);
  userId: any = this.userInfo.userId;
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

    console.log(accountType,'accountType is ===')
    console.log(userInfo,'userinifo')
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
  showModal1: boolean = false;
  toggleModal1() {
    this.showModal1 = !this.showModal1;
  }
  sidebarmodel: boolean = false;
  toggleModal2() {
    this.sidebarmodel = !this.sidebarmodel;
  }

  //25.9.2024 date of creating this function
  getUnReadNotifications(){
    console.log('header notification working')
    const userDetails  = localStorage.getItem('userInfo');
    if(userDetails){
    const userInfo = JSON.parse(userDetails);
    const userId = userInfo.userId;
    const type = userInfo.accountType;

    this.http
    .get(`${this.baseUrl}/api/getUnreadNotifications`, {
      params: {
        userId: userId,
        type : type
        // pageNo: this.currentPage.toString(),
      },
    })
    .subscribe((res: any) => {
      this.unreadMsg = res.unreadmsg;
    });
  }
  }

  closeModal(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Check if the click occurred outside the modal content
    if (!target.closest('.ml-[75%]')) {
      this.showModal1 = false;
    }
  }

  logout() {
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userInfo');
    this.toastr.success('logout successfully');
    this.router.navigate(['/signin']);
  }

  showModal = false;
  showModal3 = false;

  // toggleModal() {
  //   setTimeout(()=>{
  //     this.showModal = false;
  //     this.updateNotification();

  //   },5000)
  //   this.showModal = !this.showModal;
  // }

  toogleModal3() {
    this.updateNotification();
    this.showModal3 = !this.showModal3;
  }

  notification!: number;
  notificationSeen!: number;
  notificationUnSeen!: number;
 items:any[]=[];

  getNotifications() {
    this.http
      .get(`${this.baseUrl}/api/user`, {
        params: { id: this.userId },
      })
      .subscribe((res: any) => {
        this.notification = res.userDetails[0].notification;
        this.notificationSeen = res.userDetails[0].notificationSeen;
        this.notificationUnSeen =
          res.userDetails[0].notification - res.userDetails[0].notificationSeen;
         this.items = Array.from({ length: this.notificationUnSeen }, (_, index) => index); // Creates an array of size 5 with values [0, 1, 2, 3, 4]
        console.log(res.userDetails[0], 'res');
      });
  }

  updateNotification() {
    this.http
      .get(`${this.baseUrl}/api/users/updateNotification`, {
        params: { userId: this.userId },
      })
      .subscribe((res: any) => {
        console.log(res, 'res');
        this.getNotifications();
      });
  }

  isLoading: boolean = false;

  backToAdmin(){
    if(this.accessBy){
    this.http
    .post<any>(`${this.baseUrl}/api/users/adminLoginToUser`, {
      email: this.adminEmail,
      pass: this.adminPass,
    })
    .subscribe({
      next: async (res: any) => {
        await this.authService.SignIn(this.adminEmail, this.adminPass);
        this.accountType = res?.user[0]?.accountType;
        if(this.adminEmail){
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
              pass: res?.user[0]?.pass,
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

    }
  }
}
