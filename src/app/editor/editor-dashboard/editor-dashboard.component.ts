import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EditorDashboardService } from 'src/app/services/editor-dashboard.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editor-dashboard',
  templateUrl: './editor-dashboard.component.html',
  styleUrls: ['./editor-dashboard.component.css']
})
export class EditorDashboardComponent implements OnInit {
  profilelink:string=`/editor/profile`
  userDetails:any = localStorage.getItem('userInfo');
  userInfo:any = JSON.parse(this.userDetails);
  downloadColors = [
    { text: 'text-[#48BDD8]', text1: 'text-black', bg: 'bg-blue-300' },
    { text: 'text-black', text1: 'text-red-500', bg: 'bg-red-300' },
    { text: 'text-[#48BDD8]', text1: 'text-black', bg: 'bg-blue-300' },
    { text: 'text-[#48BDD8]', text1: 'text-black', bg: 'bg-blue-300' },
    { text: 'text-black', text1: 'text-red-500', bg: 'bg-red-300' },
    { text: 'text-[#48BDD8]', text1: 'text-black', bg: 'bg-blue-300' },
  ];
  searchText: string = '';
  isButtonActivated: number | null = null;
  baseUrl:string = environment.production;

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
    } else if (item.status === 'PendingAcceptance' || item.status === 'PendingAcceptance') {
      return ['text-red-500', 'bg-red-100'];
    }else if (item.status === 'Rejected' ) {
      return ['text-white', 'bg-red-500'];
    } else if (item.status === 'workInProgress' || item.status === 'workInProgress') {
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
    } else if (status === 'workInProgress' || status === 'workInProgress') {
      return 'assets/image/E8.png';
    } else if (status === 'UnderQAReview') {
      return 'assets/image/dot-svgrepo-com.png';
    }else if (status === 'Rejected') {
      return 'assets/image/E6.png';
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
  lastFiveOrders:any[]=[];
  orderQueued:any[]=[];
  
  constructor(private http: HttpClient,private dashboardLastOrders:EditorDashboardService) {}

  ngOnInit(): void {
    this.http
      .get<any>(`${this.baseUrl}/api/users`)
      .subscribe((res: any) => {
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
    this.http
      .get<any>(
       `${this.baseUrl}/api/users/usersAccountStatus`
      )
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
        // );
      });
    
    // dashboard last orders details
    this.dashboardLastOrders.getEditorsDashboardData(this.userInfo.userId).subscribe((res: any) => {
      this.orderQueued = res.queuedOrders;
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
      this.tempdata = this.ordersQueued
      this.View = this.ordersQueued.slice(0, 7); // Show first 7 items initially
    });
    

  }
  showAll(): void {
    console.log('showAll() function called');
    this.visibleItems = this.items;
  }
  private updateVisibleItems(): void {
    this.visibleItems = this.items.slice(0, 6);
  }
  showAll1(): void {
    console.log('showAll() function called');

    this.visibleItems2 = this.items2;
  }

  private updateVisibleItems2(): void {
    this.visibleItems2 = this.items2.slice(0, 6);
  }

  showAll3(): void {
    console.log('showAll() function called');
    this.visibleItems3 = this.items3;
  }

  private updateVisibleItems3(): void {
    this.visibleItems3 = this.items3.slice(0, 6);
  }

  ordersQueued: any[] = [];
  View: any[] = [];
  tempdata: any[] = [];
  showAlls: boolean = false;

  toggleData(): void {
    this.showAlls = !this.showAlls;
    if (this.showAlls) {
      // Show all data
      this.View = this.tempdata;
    } else {
      // Show only the first 10 items
      this.View = this.tempdata.slice(0, 6);
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
