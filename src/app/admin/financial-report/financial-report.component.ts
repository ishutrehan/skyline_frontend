import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PaymentTransactionService } from 'src/app/services/payment-transaction.service';
import { environment } from 'src/environments/environment';

interface userDetails{
  userId:number,
  username:string,
  email:string,
  workType:string,
  amountPaid:number,
  creditPaid:number
}
@Component({
  selector: 'app-financial-report',
  templateUrl: './financial-report.component.html',
  styleUrls: ['./financial-report.component.css']
})
export class FinancialReportComponent implements OnInit {

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
  users: userDetails[] = [];
  
  
  itemsPerPage: number = 8;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize = 2; 

  constructor(private http: HttpClient,
    private showAllTheTransactions: PaymentTransactionService
  ) {

  }
  user:any[]=[]
  ngOnInit(): void {
    this.fetchData()
  }

  fetchData(){
    this.showAllTheTransactions.showAllTheTransactions({ pageNo: this.currentPage }).subscribe((res:any)=>{
      this.users = res.data;
      this.totalPages = res?.totalPages; 
    console.log(res,"Data feteched successfully")
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
