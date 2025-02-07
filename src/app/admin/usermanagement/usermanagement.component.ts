import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css'],
})
export class UsermanagementComponent implements OnInit {
  isLoading: boolean = false;
  showModal = false;
  selectedUser: any;
  selectedStatus: string = '';
  baseUrl: string = environment.production;
  itemsPerPage: number = 8;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize = 2;
  myId : any = 0
  constructor(private http: HttpClient) {}

  users: any[] = [];
  // users = [
  //   {
  //     name: 'Adom',
  //     email: 'adom@gmail.com',
  //     city: 'Chandigarh',
  //     status: 'active',
  //     createdAt: '2024-06-04',
  //   },
  //   {
  //     name: 'alice',
  //     email: 'alice@gmail.com',
  //     city: 'mohali',
  //     status: 'deactive',
  //     createdAt: '2024-06-03',
  //   },
  //   {
  //     name: 'Adom',
  //     email: 'adom@gmail.com',
  //     city: 'Chandigarh',
  //     status: 'active',
  //     createdAt: '2024-06-04',
  //   },
  //   {
  //     name: 'alice',
  //     email: 'alice@gmail.com',
  //     city: 'mohali',
  //     status: 'deactive',
  //     createdAt: '2024-06-03',
  //   },
  // ];
  ngOnInit() {
    let userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      let formatted_data = JSON.parse(userInfo);
      this.myId = formatted_data.userId;
    }
    this.fetchData();
  }

  fetchData() {
    this.http
      .get(`${this.baseUrl}/api/users`, {
        params: { pageNo: this.currentPage },
      })
      .subscribe({
        next: (res: any) => {
          const onlyUsers = res.users.filter(
            (item: any) => item.accountType === 'user'
          );

          this.users = onlyUsers;
          this.totalPages = res?.totalPages;
          console.log(res, 'res');
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  userDetails: any = '';
  toggleModal(user?: any) {
    this.userDetails = user;
    this.showModal = !this.showModal;
    this.selectedStatus = user.accountStatus;
    this.selectedUser = user;
    console.log(user, 'user');
  }
  cancleButton() {
    this.showModal = false;
  }

  updateStatus() {
    console.log('Status updated to:', this.selectedStatus);
    this.http
      .put(`${this.baseUrl}/api/admin/userManagment`, {
        status: this.selectedStatus,
        userId: this.userDetails?.userId,
        admin: this.myId
      })
      .subscribe({
        next: (res: any) => {
          console.log('user update successful');
          this.fetchData();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    this.showModal = false;
  }

  // Pagination Methods
  onPrevious() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchData();
    }
  }

  onNext() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchData();
    }
  }

  setPage(page: number) {
    if (page === -1) return; // Ignore ellipsis clicks
    this.currentPage = page;
    this.fetchData();
  }

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
