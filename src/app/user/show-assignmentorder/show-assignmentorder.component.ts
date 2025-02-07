import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-show-assignmentorder',
  templateUrl: './show-assignmentorder.component.html',
  styleUrls: ['./show-assignmentorder.component.css'],
})
export class ShowAssignmentorderComponent implements OnInit {

  items: any[] = [];
  paginatedItems: any[] = [];
  typeOfuser: string = '';
  baseUrl: string = environment.production;
  constructor(private http: HttpClient, private router: Router) {}
  isLoading: boolean = false;

   itemsPerPage: number = 8;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize = 2;
  searchText:string = ''

  // constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchData();
    console.log(this.items)
  }

  hanlesearchtext(event:any){
    this.searchText = event.target.value
    console.log(this.searchText)
    this.fetchData()
  }


  fetchData() {
    this.isLoading = true;
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.typeOfuser = userInfo.accountType;

    if (userInfo.accountType === 'user') {
      this.http
        .get<any>(`${this.baseUrl}/api/getorders/${userInfo.userId}`, {
          params: { id: userInfo.userId, sortBy:this.searchText, pageNo: this.currentPage},
        })
        .subscribe((res: any) => {
          console.log(res, 'resgggggg');
          this.items = res.paginationData;
          this.totalPages = res?.totalPages;
          this.isLoading = false;

          // this.items = res.editors;
        });
    }

  }

  onClick() {
    this.isLoading = true;
  }

  onSelectOption(event: Event) {
    const selectedOption = (event.target as HTMLSelectElement).value;
    if (selectedOption === 'proofreading') {
      this.router.navigate(['/user/showorder']);
    } else if (selectedOption === 'assignment') {
      this.router.navigate(['/user/assignmentorder']);
    }
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

getStatusClasses(item: any): string[] {
  if (item.status === 'Completed' || item.status === 'completed') {
    return ['text-black', 'bg-green-100'];
  } else if (item.status === 'PendingAcceptance' || item.status === 'PendingAcceptance') {
    return ['text-red-500', 'bg-red-100'];
  } else if (item.status === 'workInProgress' || item.status === 'workInProgress') {
    return ['text-black', 'bg-blue-100'];
  } else if (item.status === 'UnderQAReview') {
    return ['text-black', 'bg-yellow-100'];
  }else if (item.status === 'Rejected') {
    return ['text-red-500', 'bg-red-100'];
  } else {
    return [];
  }
}


}
