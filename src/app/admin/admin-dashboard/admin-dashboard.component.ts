import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from 'src/app/services/admin-dashboard.service';
import { FinancialReportDashboardService } from 'src/app/services/financial-report-dashboard.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../firebaseConfig/services/auth.services';
import { userInfo } from 'os';
interface LastOrders {
  created_at: Date;
  deliveryDate: Date;
  orderId: Number;
  status: string;
  type: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  downloadColors = [
    { text: 'text-[#48BDD8]', text1: 'text-black', bg: 'bg-blue-300' },
    { text: 'text-black', text1: 'text-red-500', bg: 'bg-red-300' },
    { text: 'text-[#48BDD8]', text1: 'text-black', bg: 'bg-blue-300' },
    { text: 'text-[#48BDD8]', text1: 'text-black', bg: 'bg-blue-300' },
    { text: 'text-black', text1: 'text-red-500', bg: 'bg-red-300' },
    { text: 'text-[#48BDD8]', text1: 'text-black', bg: 'bg-blue-300' },
  ];

  toggledashboards: boolean = false;
  isButtonActivated: number | null = null;
  isLoading: boolean = false;
  profilelink: string = `/admin/profile`;
  tempdata: any = [];

  toggleButton(buttonNumber: number) {
    if (this.isButtonActivated === buttonNumber) {
      this.isButtonActivated = null;
    } else {
      this.isButtonActivated = buttonNumber;
    }
  }

  avatarAlt: string = 'Avatar';
  cs1Src: string = 'assets/image/cs1.png';
  cs2Src: string = 'assets/image/cs2.png';
  cs3Src: string = 'assets/image/Icon.png';

  getStatusClasses(item: any): string[] {
    if (item.status === 'Completed' || item.status === 'completed') {
      return ['text-black', 'bg-green-100'];
    } else if (item.status === 'Rejected') {
      return ['text-white', 'bg-red-500'];
    } else if (
      item.status === 'PendingAcceptance' ||
      item.status === 'PendingAcceptance'
    ) {
      return ['text-red-500', 'bg-red-100'];
    } else if (
      item.status === 'workInProgress' ||
      item.status === 'workInProgress'
    ) {
      return ['text-black', 'bg-blue-100'];
    } else if (item.status === 'UnderQAReview') {
      return ['text-black', 'bg-yellow-100'];
    } else {
      return [];
    }
  }

  getStatusImage(status: string): string {
    if (status === 'Completed' || status === 'completed') {
      return 'assets/image/circle-svgrepo-com.png'; //add image for it
    } else if (
      status === 'PendingAcceptance' ||
      status === 'PendingAcceptance'
    ) {
      return 'assets/image/E6.png';
    } else if (status === 'Rejected') {
      return 'assets/image/E6.png';
    } else if (status === 'workInProgress' || status === 'workInProgress') {
      return 'assets/image/E8.png';
    } else if (status === 'UnderQAReview') {
      return 'assets/image/dot-svgrepo-com.png';
    } else {
      return '';
    }
  }
  items: any[] = [];
  visibleItems: any[] = [];
  items2: any[] = [];
  visibleItems2: any[] = [];
  items3: any[] = [];
  visibleItems3: any[] = [];
  image: string = 'https://img.icons8.com/?size=2x&id=492ILERveW8G&format=png';
  activeUsers: number = 0;
  deactivateUsers: number = 0;
  deleteUsers: number = 0;
  baseUrl: string = environment.production;
  lastOrders: LastOrders[] = [];
  orderQueued: any[] = [];
  View: any[] = [];
  searchText: string = '';
  userInfo: any ;
  constructor(
    private http: HttpClient,
    private getOrders: AdminDashboardService,
    private montlyRevenue: FinancialReportDashboardService,
    private router: Router,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {

    let myInfo  = localStorage.getItem('userInfo')
    if(myInfo){
      this.userInfo= JSON.parse(myInfo)
    }
    this.http.get<any>(`${this.baseUrl}/api/users`).subscribe((res: any) => {
      res.allusers.forEach((user: any) => {
        // const { name, email } = user;
        console.log(user)
        this.items.push(user);
      });
      // res.users.forEach((user: any) => {
      //   console.log(user);
      //   this.items.push(user);
      // });
      console.log(res, 'this is the users');
      this.updateVisibleItems();
    });
    // this.http.get<any>('https://dummyjson.com/users').subscribe((res1: any) => {
    //   this.items2 = res1.users;
    //   this.updateVisibleItems2();
    //   this.items3 = res1.users;
    //   this.updateVisibleItems3();
    // });
    this.http
      .get<any>(`${this.baseUrl}/api/users/usersAccountStatus`)
      .subscribe((res: any) => {
        // console.log(res, 'Res siisiisi');

        res.usersAccountInfo.filter((data: any) => {
          if (data.accountStatus === 'active') {
            this.activeUsers = data.userStatus;
          }
        });
        res.usersAccountInfo.filter((data: any) => {
          if (data.accountStatus === 'deactivate') {
            this.deactivateUsers = data.userStatus;
          }
        });
        res.usersAccountInfo.filter((data: any) => {
          if (data.accountStatus === 'delete') {
            this.deleteUsers = data.userStatus;
          }
        });

        // show last 5 orders and queued orders
        this.getOrders.getLastOrders().subscribe((res: any) => {
          this.lastOrders = res.lastFiveOrders.map((data: any) => {
            const val = data.created_at;
            const date = new Date(val);
            const options: any = {
              day: 'numeric',
              month: 'long',
              year: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false, // 24-hour format
            };
            const formattedDate = date.toLocaleString('en-GB', options);
            return {
              ...data,
              created_at: formattedDate,
            };
          });
          this.orderQueued = res.queuedOrders;
          this.tempdata = res.queuedOrders;
          this.View = this.orderQueued.slice(0, 10);
        });

        console.log(this.lastOrders, 'this.lastOrders');
        // );
      });
  }

  hanlesearchtext(event: any) {
    this.tempdata = this.orderQueued;
    this.searchText = event.target.value;
    if (this.searchText === '') {
      this.tempdata = this.orderQueued;
    } else {
      this.tempdata = this.tempdata.filter(
        (items: any) => items.status === this.searchText
      );
    }
    this.View = this.tempdata.slice(0, 10);
  }

  showAll(): void {
    console.log('showAll() function called');
    this.visibleItems = this.items;
  }
  private updateVisibleItems(): void {
    this.visibleItems = this.items;
  }
  showAll1(): void {
    console.log('showAll() function called');

    this.visibleItems2 = this.items2;
  }

  private updateVisibleItems2(): void {
    this.visibleItems2 = this.items2.slice(0, 5);
  }

  showAll3(): void {
    console.log('showAll() function called');
    this.visibleItems3 = this.items3;
  }

  private updateVisibleItems3(): void {
    this.visibleItems3 = this.items3.slice(0, 7);
  }
  getUkBasedTime(time: any): string {
    console.log(time, 'time');
    const date = new Date(time);
    const options: any = {
      day: 'numeric',
      month: 'long',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 24-hour format
    };
    return date.toLocaleString('en-GB', options);
  }

  showAlls: boolean = false;
  toggleData(): void {
    this.showAlls = !this.showAlls;
    if (this.showAlls) {
      // Show all data
      this.View = this.tempdata;
    } else {
      // Show only the first 10 items
      this.View = this.tempdata.slice(0, 10);
    }
  }
  toggleOtherDashboard(item: any) {
    this.http
      .post<any>(`${this.baseUrl}/api/users/adminLoginToUser`, {
        email: item.email,
        pass: item.pass,
      })
      .subscribe({
        next: async (res: any) => {
          await this.authService.SignIn(item.email, item.password);
          item.accountType = res?.user[0]?.accountType;
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
              accessBy: 'admin',
              adminEmail:this.userInfo.email,
              adminPass:this.userInfo.pass,
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

          this.isLoading = false;
          this.toastr.success('login successfully');
          this.router.navigate([`${item.accountType}/dashboard`]);
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error('Email Id or Password incorrect');
        },
      });
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
