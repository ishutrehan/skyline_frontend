import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserDashboardService } from 'src/app/services/user-dashboard.service';
import { environment } from 'src/environments/environment';

interface OrderDetails {
  created_at: Date;
  deliveryDate: Date;
  orderId: number;
  status: string;
  type: string;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  profilelink:string=`/user/profile`
  userDetails: any = localStorage.getItem('userInfo');
  userInfo: any = JSON.parse(this.userDetails);
  downloadColors = [
    { text: 'text-[#48BDD8]', text1: 'text-black', bg: 'bg-blue-300' },
    { text: 'text-black', text1: 'text-red-500', bg: 'bg-red-300' },
    { text: 'text-[#48BDD8]', text1: 'text-black', bg: 'bg-blue-300' },
    { text: 'text-[#48BDD8]', text1: 'text-black', bg: 'bg-blue-300' },
    { text: 'text-black', text1: 'text-red-500', bg: 'bg-red-300' },
    { text: 'text-[#48BDD8]', text1: 'text-black', bg: 'bg-blue-300' },
  ];

  isButtonActivated: number | null = null;
  isLoading: boolean = false;

  avatarAlt: string = 'Avatar';
  cs1Src: string = 'assets/image/cs1.png';
  cs2Src: string = 'assets/image/cs2.png';
  cs3Src: string = 'assets/image/Icon.png';

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
  searchText: string = '';

  lastFiveOrders: OrderDetails[] = [];
  ordersQueued: OrderDetails[] = [];
  View: OrderDetails[] = [];
  tempdata: OrderDetails[] = [];
  showAlls: boolean = false;

  constructor(private http: HttpClient, private userDashboard: UserDashboardService) {}

  ngOnInit(): void {
    this.http.get<any>(`${this.baseUrl}/api/users`).subscribe((res: any) => {
      res.users.forEach((user: any) => {
        const { name, email, city } = user;
        this.items.push({ firstName: name, email, image: this.image, city });
      });
      this.updateVisibleItems();
    });

    // this.http.get<any>('https://dummyjson.com/users').subscribe((res1: any) => {
    //   this.items2 = res1.users;
    //   this.updateVisibleItems2();
    //   this.items3 = res1.users;
    //   this.updateVisibleItems3();
    // });

    this.http.get<any>(`${this.baseUrl}/api/users/usersAccountStatus`).subscribe((res: any) => {
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

      this.userDashboard.getUserDashboardDetails(this.userInfo.userId).subscribe((res: any) => {
        this.lastFiveOrders = res.lastFiveOrders.map((data: any) => {
          const val = data.created_at;
          const date = new Date(val);
          const options: any = { 
            day: 'numeric', 
            month: 'long', 
            year: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false // 24-hour format
          };
          const formattedDate = date.toLocaleString('en-GB', options);
          return {
            ...data,
            created_at: formattedDate
          };
        });
        
        this.ordersQueued = res.queuedOrders;
        this.tempdata = res.queuedOrders;
        this.View = this.ordersQueued.slice(0, 10); // Show first 10 items initially
      });
      
    });
  }

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

  hanlesearchtext(event:any){
     this.tempdata = this.ordersQueued
    this.searchText = event.target.value
    if(this.searchText === ''){
      this.tempdata = this.ordersQueued
    }
    else{
      this.tempdata =  this.tempdata.filter((items)=>items.status === this.searchText)
    }
    this.View = this.tempdata.slice(0, 10);
  }

  getStatusClasses(item: any): string[] {
    if (item.status === 'Completed' || item.status === 'completed') {
      return ['text-black', 'bg-green-100'];
    } else if (item.status === 'PendingAcceptance' || item.status === 'PendingAcceptance') {
      return ['text-red-500', 'bg-red-100'];
    }else if (item.status === 'Rejected') {
      return ['text-red-700', 'bg-red-100'];
    }else if (item.status === 'workInProgress' || item.status === 'workInProgress') {
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
    } else if (status === 'PendingAcceptance' || status === 'PendingAcceptance') {
      return 'assets/image/E6.png';
    }else if (status === 'Rejected') {
      return 'assets/image/E6.png';
    } else if (status === 'workInProgress' || status === 'workInProgress') {
      return 'assets/image/E8.png';
    } else if (status === 'UnderQAReview') {
      return 'assets/image/dot-svgrepo-com.png';
    } else {
      return '';
    }
  }

  private updateVisibleItems(): void {
    this.visibleItems = this.items.slice(0, 5);
  }

  private updateVisibleItems2(): void {
    this.visibleItems2 = this.items2.slice(0, 5);
  }

  private updateVisibleItems3(): void {
    this.visibleItems3 = this.items3.slice(0, 7);
  }

  toggleButton(buttonNumber: number) {
    if (this.isButtonActivated === buttonNumber) {
      this.isButtonActivated = null;
    } else {
      this.isButtonActivated = buttonNumber;
    }
  }

  onClick() {
    this.isLoading = true;
  }

  showAll(): void {
    console.log('showAll() function called');
    this.visibleItems = this.items;
  }

  showAll1(): void {
    console.log('showAll() function called');
    this.visibleItems2 = this.items2;
  }

  showAll3(): void {
    console.log('showAll() function called');
    this.visibleItems3 = this.items3;
  }

  getUkBasedTime(time: any): string {
    console.log(time,"time")
    const date = new Date(time);
    const options: any = { 
      day: 'numeric', 
      month: 'long', 
      year: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: false // 24-hour format
    };
    return date.toLocaleString('en-GB', options);
  }
}
