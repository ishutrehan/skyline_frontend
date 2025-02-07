import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.css'],
})
export class UserNotificationComponent implements OnInit {
  baseUrl: string = environment.production;
  deleteSrc: string = 'assets/image/delete-1-svgrepo-com.png';
  userId: number = 0;
  userType :string =''
  items: any = [];
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.fetchNotifications();
    // this.markasRead();
  }

  fetchNotifications = async () => {
    const userDetails = localStorage.getItem('userInfo');
    if (userDetails) {
      const data = JSON.parse(userDetails);
      this.userId = data.userId;
      this.userType = data.accountType;
      this.http
        .get(`${this.baseUrl}/api/showNotifications`, {
          params: {
            userId: this.userId,
            userType : this.userType,
            pageNo: this.currentPage,
            // pageNo: this.currentPage.toString(),
          },
        })
        .subscribe((res: any) => {
          this.items = res.rows;
          if (this.items) {
            this.markasRead();
          }
          this.totalPages = res?.totalPages;

        });
    }
  };

  markasRead() {
    const userDetails = localStorage.getItem('userInfo');
    const arrlist = JSON.stringify(this.items);
    if (userDetails) {
      const data = JSON.parse(userDetails);
      this.userId = data.userId;
      this.http
        .get(`${this.baseUrl}/api/markNotificationsAsSeen`, {
          params: {
            userId: this.userId,
            list: arrlist,
            type: data.accountType,
          },
        })
        .subscribe((res: any) => {
          console.log('All Notification Were Marked as read');
        });
    }
  }

  handleDeleteNotifications(id: number) {
    console.log(id);
    try {
      this.http
        .delete(`${this.baseUrl}/api/deleteNotifications`, {
          params: {
            notificationId: id,
            // pageNo: this.currentPage.toString(),
          },
        })
        .subscribe((res: any) => {
          if (res) {
            this.fetchNotifications();
            this.toastr.success('Notification Deleted successfully');
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  handleDeleteAll = () => {
    if(this.items.length > 0) {
    try {
      this.http
        .delete(`${this.baseUrl}/api/deleteAllNotifications`)
        .subscribe((res: any) => {
          if (res) {
            this.fetchNotifications();
            this.toastr.success(' All Notification are Deleted successfully');
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
  else{
    this.toastr.warning("You Don't have any notifications");

  }
  };

  // Pagination Methods
  onPrevious() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchNotifications();
    }
  }

  onNext() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchNotifications();
    }
  }

  setPage(page: number) {
    if (page === -1) return; // Ignore ellipsis clicks
    this.currentPage = page;
    this.fetchNotifications();
  }

  itemsPerPage: number = 7;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 2;

  // Generate the page numbers to show in pagination
  getPagesToShow(): number[] {
    const pages = [];
    const lastPage = this.totalPages;

    // Always include the first page
    pages.push(1);

    let startPage = Math.max(2, this.currentPage); // Start from currentPage or 2
    let endPage = startPage + 1; // Ensure we show two middle pages

    // Adjust start and end when near the end of the page range
    if (endPage >= lastPage - 2) {
      startPage = lastPage - 3;
      endPage = lastPage - 1;
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < lastPage) {
        pages.push(i);
      }
    }

    // Always add ellipsis in the second last position
    if (lastPage > 3) {
      pages.push(-1); // Ellipsis
    }

    // Always include the last page
    pages.push(lastPage);
    if(pages[1] < 2){
      pages.length =1
    }
    return pages;
  }
}
