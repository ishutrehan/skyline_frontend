import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subscription, interval, switchMap, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-myscan',
  templateUrl: './user-myscan.component.html',
  styleUrls: ['./user-myscan.component.css'],
})
export class UserMyscanComponent implements OnInit, OnDestroy {
  scanId: string = '';
  documentName: string = '';
  documentType: string = '';
  human: number = 0;
  ai: number = 0;
  probability: number = 0;
  charsCount: number = 0;
  wordCount: number = 0;
  documentData: string = '';
  created_at: string = '';
  showIcons: boolean = false;
  items: any[] = [];
  exportTheseData: any[] = [];
  isLoading: boolean = true;
  baseUrl: string = environment.production;
  pollingSubscription: Subscription | undefined;
  lightsharesvg: SafeHtml;
  darksharesvg: SafeHtml;
  lightdeletesvg: SafeHtml;
  darkdeletesvg: SafeHtml;
  selectedCheckboxes: Set<string> = new Set();
  userInfo: any = localStorage.getItem('userInfo');
  userDetails: any = JSON.parse(this.userInfo);
  totalPage: any = 1;
  currentPage: number = 1;
  searchText: string = '';
  arrayOfLinks: any = [];
  loading_text: string = 'Please Wait A Moment...';

  onEnterKeyPress(): void {
    console.log('Search Text:', this.searchText);
    this.fetchData();
  }

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {
    this.lightsharesvg = this.sanitizer.bypassSecurityTrustHtml(`
      <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <g id="Communication / Share_Android">
            <path id="Vector" d="M9 13.5L15 16.5M15 7.5L9 10.5M18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18C21 19.6569 19.6569 21 18 21ZM6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12C9 13.6569 7.65685 15 6 15ZM18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6C21 7.65685 19.6569 9 18 9Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </g>
        </g>
      </svg>
    `);
    this.darksharesvg = this.sanitizer.bypassSecurityTrustHtml(`
     <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Communication / Share_Android"> <path id="Vector" d="M9 13.5L15 16.5M15 7.5L9 10.5M18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18C21 19.6569 19.6569 21 18 21ZM6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12C9 13.6569 7.65685 15 6 15ZM18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6C21 7.65685 19.6569 9 18 9Z" stroke="#ff565f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
    `);
    this.lightdeletesvg = this.sanitizer.bypassSecurityTrustHtml(`
     <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 5H18M9 5V5C10.5769 3.16026 13.4231 3.16026 15 5V5M9 20H15C16.1046 20 17 19.1046 17 18V9C17 8.44772 16.5523 8 16 8H8C7.44772 8 7 8.44772 7 9V18C7 19.1046 7.89543 20 9 20Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
     `);
    this.darkdeletesvg = this.sanitizer.bypassSecurityTrustHtml(`
      <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 5H18M9 5V5C10.5769 3.16026 13.4231 3.16026 15 5V5M9 20H15C16.1046 20 17 19.1046 17 18V9C17 8.44772 16.5523 8 16 8H8C7.44772 8 7 8.44772 7 9V18C7 19.1046 7.89543 20 9 20Z" stroke="#ff565f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
      `);
  }

  // share report

  fileName: string = '';
  ownerEmail: string = 'abcd@gmail.com'; //take it from localStorage
  recipientEmail: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  linkToBeCoppied: any = environment.frontendUrl;
  value: any = '';

  sendMailTo() {
    if (this.recipientEmail.valid) {
      // console.log('Sending email to:', this.recipientEmail.value);
      // this.http
      //   .post(`${this.baseUrl}/api/scan/mailTransfer`, {
      //     email: this.recipientEmail.value,
      //     link: this.linkToBeCoppied +
      //       `/${Array.from(this.selectedCheckboxes)[0]}/${this.userDetails.userId}`,
      //   })
      // console.log(this.arrayOfLinks)
      this.http
        .post(`${this.baseUrl}/api/scan/mailTransfer`, {
          email: this.recipientEmail.value,
          link: this.arrayOfLinks,
        })
        .subscribe((res: any) => {
          console.log(res, 'res mail');
          this.toastr.success('Mail Sent');
          this.arrayOfLinks = [];
        });
      // .subscribe((res: any) => {
      //   console.log(res, 'res mail');
      //   this.toastr.success('Mail Sent');
      // });
      // You can perform further actions like sending the email using a service
    } else {
      this.toastr.warning('Use Valid Email Address');
    }
    this.selectedCheckboxes.clear();
    this.updateImageState();
    this.items.map((item) => {
      item.isSelected = false;
    });
  }

  showModal1: boolean = false;

  onShareBtnClick(event: any) {
    // if (this.selectedCheckboxes.size === 1) {
    //   this.linkToBeCoppied =
    //     this.linkToBeCoppied +
    //     `/${Array.from(this.selectedCheckboxes)[0]}/${this.userDetails.userId}`;
    //   this.value = this.linkToBeCoppied;
    //   console.log(this.value)
    //   this.showModal1 = true;
    // } else if (this.selectedCheckboxes.size > 1) {
    //   this.toastr.warning('Share only one document at a time.');
    // } else {
    //   this.showModal1 = false;
    // }
    // this.linkToBeCoppied = environment.frontendUrl;

    if (this.selectedCheckboxes.size > 0) {
      for (let index = 0; index < this.selectedCheckboxes.size; index++) {
        this.linkToBeCoppied += `/${
          Array.from(this.selectedCheckboxes)[index]
        }/${this.userDetails.userId}`;
        this.arrayOfLinks.push(this.linkToBeCoppied);
        this.linkToBeCoppied = environment.frontendUrl;
      }
      this.showModal1 = true;
    } else {
      this.showModal1 = false;
    }
  }

  cancleModal() {
    this.items.map((item) => {
      item.isSelected = false;
    });
    this.arrayOfLinks = [];
    this.selectedCheckboxes.clear();
    this.updateImageState();
  }
  onCopySuccess() {
    this.toastr.success('Data copied successfully!');
  }

  ngOnInit(): void {
    console.log(this.loading_text)

    this.fetchData();
    setTimeout(() => {
      this.fetchData();
      setTimeout(() => {
        this.loading_text = 'Fetching Resources...';
        console.log(this.loading_text)
      }, 500);
      setTimeout(() => {
        this.loading_text = 'Report is generating...';
        console.log(this.loading_text)

      }, 12000);
      setTimeout(() => {
        this.loading_text = 'Finalizing Report Structure...';
        console.log(this.loading_text)

      }, 20000);
    }, 10000);
    if(this.items[0].scanId !== null){
      setTimeout(() => {
        this.fetchData();
      }, 100);
    }


  }

  ngOnDestroy(): void {
    this.stopPolling();
  }


  downloadData(): void {
    const requestPayload = Array.from(this.selectedCheckboxes);
    console.log(requestPayload, 'reques99999999000000');
    this.http
      .post(`${this.baseUrl}/api/scan/reportsDownloading`, requestPayload, {
        responseType: 'blob',
      })
      .subscribe(
        (res: Blob) => {
          const isSingleFile = requestPayload?.length === 1;
          const fileName = isSingleFile
            ? `${requestPayload[0]}report.pdf` // Generate filename for single file
            : 'reports.zip'; // Default filename for ZIPreportsDownloading

          // Create a Blob URL and trigger download
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(res);
          link.download = fileName;
          link.click();

          // Clean up resources
          window.URL.revokeObjectURL(link.href);

          this.toastr.success(
            isSingleFile
              ? 'File downloaded successfully'
              : 'Files downloaded successfully'
          );
        },
        (error) => {
          console.error('Error downloading file(s)', error);
          this.toastr.error('Failed to download file(s), try again later');
        }
      );
    this.items.map((item) => {
      item.isSelected = false;
    });
    this.selectedCheckboxes.clear();
  }

  fetchData(): void {
    this.http
      .get(`${this.baseUrl}/api/scan/showscandata`, {
        params: {
          userId: this.userDetails.userId,
          search: this.searchText,
          pageNo: this.currentPage.toString(),
        },
      })
      .subscribe((res: any) => {
        console.log('sdf', res);
        if (res?.result[0]?.scanId === null) {
          this.isLoading = true;
        }
        if (res?.result[0]?.scanId === null) {
          setTimeout(() => {
            this.fetchData();
          }, 20000);
        }
        if (res?.result || res?.result[0]?.scanId !== null) {
          this.totalPage = res.totalPages;
          this.items = [];
          this.exportTheseData = [];
          res.result.forEach((item: any) => {
            const {
              documentType,
              documentName,
              created_at,
              aggregatedScore,
              aiScore,
              humanScore,
              probabilityAIContent,
              scanId,
            } = item;
            this.exportTheseData.push({
              id: scanId,
              name: documentName.replace(/^\d+-/, ''),
              Date: created_at,
              AIScore: aiScore,
              PlagiarismScore: aggregatedScore,
            });
            const exactDate = new Date(created_at);
            this.items.push({
              Type: documentType,
              Name: documentName.replace(/^\d+-/, ''),
              Date: `${exactDate.getDate()}/${
                exactDate.getMonth() + 1
              }/${exactDate.getFullYear()}`,
              AI_Content_Detected:probabilityAIContent,
              Plagiarism_Score: aggregatedScore,
              scanId,
              isSelected: false,
            });
            console.log('got it ', this.items);
          });
        }
        if (res?.result[0]?.scanId !== null || res?.result) {
          this.isLoading = false;
        }
        this.showIcons = true;
      });
    this.searchText = '';
  }

  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  onClick() {
    this.toastr.warning('Scans data are loading...');
    this.isLoading = true;
  }

  // export data in csv
  exportData(): void {
    // put your orignal files you want to download   currently these are the wrong files
    const csvData = this.convertToCSV(this.exportTheseData);
    for (let index = 0; index < this.selectedCheckboxes.size; index++) {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `scan-data-export-${index}.csv`);
    }
    this.items.map((item) => {
      item.isSelected = false;
    });
  }

  convertToCSV(objArray: any[]): string {
    const array = [Object.keys(objArray[0])].concat(objArray);
    return array
      .map((row) => {
        return Object.values(row)
          .map((value) => {
            return typeof value === 'string'
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(',');
      })
      .join('\n');
  }

  pdfSrc: string = 'assets/image/pdf-file-svgrepo-com (1).png';
  textSrc: string = 'assets/image/text-square-svgrepo-com.png';
  OrcSrc: string = 'assets/image/images-svgrepo-com.png';
  searchSrc: string = 'assets/image/search-svgrepo-com.png';
  downloadSrc: string = 'assets/image/download-minimalistic-svgrepo-com.png';
  refreshSrc: string = 'assets/image/refresh-cw-svgrepo-com.png';
  deleteSrc: string = 'assets/image/delete-1-svgrepo-com.png';
  addfolderSrc: string = 'assets/image/add-folder-svgrepo-com.png';
  uploadSrc: string = 'assets/image/upload-minimalistic-svgrepo-com.png';
  shareSrc: string = 'assets/image/share-svgrepo-com.png';
  moveSrc: string = 'assets/image/move-to-folder-svgrepo-com.png';
  editSrc: string = 'assets/image/edit-3-svgrepo-com.png';
  docxSrc: string = 'assets/image/docx.png';
  docSrc: string = 'assets/image/doc.png';
  xlsxSrc: string = 'assets/image/excel-file-xlsx-svgrepo-com.png';
  xlsSrc: string = 'assets/image/excel-file-xls-svgrepo-com.png';

  onCheckboxChange(event: Event, scanId: string, item: any): void {
    const checked = !item.isSelected;
    item.isSelected = checked;
    if (checked) {
      this.selectedCheckboxes.add(scanId);
    } else {
      this.selectedCheckboxes.delete(scanId);
    }
    this.updateImageState();
  }

  updateImageState(): void {
    const anyChecked = this.selectedCheckboxes.size > 0;
    this.lightsharesvg = anyChecked
      ? this.darksharesvg
      : (this.lightsharesvg = this.sanitizer.bypassSecurityTrustHtml(`
      <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <g id="Communication / Share_Android">
            <path id="Vector" d="M9 13.5L15 16.5M15 7.5L9 10.5M18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18C21 19.6569 19.6569 21 18 21ZM6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12C9 13.6569 7.65685 15 6 15ZM18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6C21 7.65685 19.6569 9 18 9Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </g>
        </g>
      </svg>
    `));
    this.lightdeletesvg = anyChecked
      ? this.darkdeletesvg
      : (this.lightdeletesvg = this.sanitizer.bypassSecurityTrustHtml(`
      <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 5H18M9 5V5C10.5769 3.16026 13.4231 3.16026 15 5V5M9 20H15C16.1046 20 17 19.1046 17 18V9C17 8.44772 16.5523 8 16 8H8C7.44772 8 7 8.44772 7 9V18C7 19.1046 7.89543 20 9 20Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
      `));
  }

  // pagination
  onPrevious() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.logCurrentPage();
    }
  }

  onNext() {
    if (this.currentPage < this.totalPage) {
      this.currentPage++;
      this.logCurrentPage();
    }
  }

  setPage(page: number) {
    this.currentPage = page;
    this.logCurrentPage();
  }

  logCurrentPage() {
    this.fetchData();
  }

  // delete functionality
  onDeleteFunctionality(event: any) {
    if (Array.from(this.selectedCheckboxes).length === 0) {
      this.toastr.warning('Select scan data to delete');
    }
    const scanIds: any = [];
    Array.from(this.selectedCheckboxes).map((data: any) => {
      scanIds.push(data);
    });

    this.http
      .post(`${this.baseUrl}/api/scan/deleteFiles`, {
        scanIds,
        userId: this.userDetails.userId,
      })
      .subscribe((res: any) => {
        this.toastr.success('deleted successfully');
        console.log('deleted successfully');
        this.fetchData();
      });
    this.selectedCheckboxes.clear();
    this.updateImageState();
    console.log(scanIds, 'delete function');
  }
  getPagesToShow(): number[] {
    const pages = [];
    const lastPage = this.totalPage;

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
