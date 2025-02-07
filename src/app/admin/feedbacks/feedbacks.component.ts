import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.css']
})
export class FeedbacksComponent implements OnInit {
  

  constructor(private http: HttpClient) {}
  baseUrl: string = environment.production;
  isLoading: boolean = false;
  items: any[] = [];
  allData: any[] = [];
  showAll: boolean = false;

  itemsPerPage: number = 8;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize = 2; 

  ngOnInit(): void {
   this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
  
    this.http.get(`${this.baseUrl}/api/feedbacks`, {
      params: { pageNo: this.currentPage },
    })
    .subscribe((res: any) => {
      console.log(res, 'response');
      this.items = res.data; 
      this.totalPages = res?.totalPages; 
      this.isLoading = false;
    });
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
