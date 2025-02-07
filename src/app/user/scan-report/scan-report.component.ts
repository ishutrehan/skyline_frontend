import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CopyleaksService,
  ScanSource,
  CompleteResult,
  ScanResult,
} from '@copyleaks/plagiarism-report';
import { environment } from 'src/environments/environment';
import { interval, Subscription, of, Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-scan-report',
  templateUrl: './scan-report.component.html',
  styleUrls: ['./scan-report.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ScanReportComponent implements OnInit, OnDestroy {
  userInfo: any = localStorage.getItem('userInfo');
  userDetails: any = JSON.parse(this.userInfo);
  baseUrl: string = environment.production;
  private pollingSubscription: Subscription | undefined;
  scanDataId: any = '';
  showConfig: any = false;
  constructor(
    private reportService: CopyleaksService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) {}

  value: any = '';
  scanRecord: any;
  fileName: string = '';
  ownerEmail: string = 'abcd@gmail.com'; //take it from localStorage
  recipientEmail: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  linkToBeCoppied: any = environment.frontendUrl;

  sendMailTo() {
    if (this.recipientEmail.valid) {
      console.log('Sending email to:', this.recipientEmail.value);
      this.http
        .post(`${this.baseUrl}/api/scan/mailTransfer`, {
          email: this.recipientEmail.value,
          link: this.linkToBeCoppied,
        })
        .subscribe((res: any) => {
          console.log(res, 'res mail');
          this.toastr.success('Mail Sent');
        });
      // You can perform further actions like sending the email using a service
    } else {
      this.toastr.warning('Use Valid Email Address');
    }
  }

  showModal1: boolean = false;

  onShareBtnClick(event: any) {
    this.showModal1 = !this.showModal1;
  }

  onCopySuccess() {
    this.toastr.success('Data copied successfully!');
  }

  ngOnInit(): void {
    const scanId = this.route.snapshot.paramMap.get('id');
    const userId = this.userDetails.userId;
    this.linkToBeCoppied = this.linkToBeCoppied + '/' + scanId + '/' + userId;
    // Assuming userId is always 6
    this.scanDataId = scanId;
    this.value = this.linkToBeCoppied;
    // Initial load and start polling
    this._startPolling(scanId, userId);

    this.http
      .post(`${this.baseUrl}/api/scan/getSingleScan`, { scanId: scanId })
      .subscribe(
        (res) => {
          console.log('Scan Record:', res);
          this.scanRecord = res; // Assuming you want to store the response
        },
        (error) => {
          console.error('Error fetching scan record:', error);
        }
      );
  }

  ngOnDestroy(): void {
    // Clean up the subscription on component destruction
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  private _startPolling(scanId: any, userId: any) {
    this.pollingSubscription = interval(10000) // Poll every 10 seconds
      .pipe(
        switchMap(() =>
          this._buildCopyleaksReportAsync(scanId, userId).pipe(
            catchError((error) => {
              console.error('Polling error', error);
              return of(null);
            })
          )
        )
      )
      .subscribe(
        (result) => {
          if (result) {
            console.log('Polling result -- ', result);
          }
        },
        (error) => {
          console.error('Polling error', error);
        }
      );
  }

  private _buildCopyleaksReportAsync(scanId: any, userId: any) {
    return new Observable<void>((observer) => {
      (async () => {
        try {
          const source = await this.http
            .get<ScanSource>(
              `${this.baseUrl}/api/scan/getSourceFile/${userId}/${scanId}`
            )
            .toPromise();

          console.log('source -- ', source);

          if (source) {
            this.reportService.pushDownloadedSource(source);
          }

          const complete = await this.http
            .get<CompleteResult>(
              `${this.baseUrl}/api/scan/getCompleteFile/${userId}/${scanId}`
            )
            .toPromise();

          console.log('complete -- ', complete);

          if (complete) {
            this.reportService.pushCompletedResult(complete);

            const allResultsIds = [
              ...complete.results.internet.map((r: any) => r.id),
              ...complete.results.database.map((r: any) => r.id),
              ...complete.results.batch.map((r: any) => r.id),
              ...(complete.results.repositories?.map((r) => r.id) || []),
            ];

            await Promise.all(
              allResultsIds.map(async (id: string) => {
                const result = await this.http
                  .get<ScanResult>(
                    `${this.baseUrl}/api/scan/getResultsFile/${userId}/${scanId}/${id}.json`
                  )
                  .toPromise();
                if (result) {
                  this.reportService.pushScanResult({ id, result });
                }
              })
            );
          }

          observer.next();
          observer.complete();
        } catch (error) {
          console.error(error);
          observer.error(error);
        }
      })();
    });
  }

  public config: any = {
    contentMode: 'html',
    download: true,
    help: false,
    disableSuspectBackButton: false,
    options: {
      showPageSources: true,
      showOnlyTopResults: true,
      showRelated: true,
      showIdentical: true,
      showMinorChanges: true,
      setAsDefault: false,
    },
    scanId: null,
    share: true,
    sourcePage: 1,
    suspectId: null,
    suspectPage: 1,
    viewMode: 'one-to-many',
  };

  // onDownloadBtnClick(event: any) {
  //   this.http
  //     .post(
  //       `${this.baseUrl}/api/scan/downloadPdfReport`,
  //       { filePath: this.scanDataId },
  //       { responseType: 'blob' }
  //     )
  //     .subscribe(
  //       (res: Blob) => {
  //         // Create a Blob from the response data
  //         const blob = new Blob([res], { type: 'application/pdf' });

  //         // Create a link element, set its href and download attributes, and simulate a click
  //         const link = document.createElement('a');
  //         link.href = window.URL.createObjectURL(blob);
  //         link.download = this.scanDataId;
  //         link.click();

  //         // Clean up resources
  //         window.URL.revokeObjectURL(link.href);
  //         this.toastr.success('File downloaded successfully');
  //       },
  //       (error) => {
  //         console.error('Error downloading file', error);
  //         this.toastr.error('Report not found try again later');

  //         // Handle error as needed
  //       }
  //     );
  // }

  onDownloadBtnClick = async (event: any) => {
    //for plagiarism only
    let pdfFor = this.scanDataId.split('-');
    pdfFor = pdfFor[pdfFor.length - 1];
    console.log(pdfFor,this.scanDataId, 'sort by name');
    if (pdfFor == 'plagiarism') {
      this.http
        .post(
          `${this.baseUrl}/api/scan/downloadPdfReport`,
          { filePath: this.scanDataId },
          { responseType: 'blob' }
        )
        .subscribe(
          (res: Blob) => {
            // Create a Blob from the response data
            const blob = new Blob([res], { type: 'application/pdf' });

            // Create a link element, set its href and download attributes, and simulate a click
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = this.scanDataId;
            link.click();

            // Clean up resources
            window.URL.revokeObjectURL(link.href);
            this.toastr.success('File downloaded successfully');
          },
          (error) => {
            console.error('Error downloading file', error);
            this.toastr.error('Report not found try again later');

            // Handle error as needed
          }
        );


    }

    // when both true zip file downlaod
    else if (pdfFor === 'both') {
      console.log('ya chla')
      this.http
        .post(
          `${this.baseUrl}/api/scan/downloadPdfReportforAI`,
          { filePath: this.scanDataId },
          { responseType: 'blob' }
        )
        .subscribe(
          (res: Blob) => {
            // Create a Blob from the response data
            const blob = new Blob([res], { type: 'application/pdf' });

            // Create a link element, set its href and download attributes, and simulate a click
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download =
              this.scanRecord.documentName.split('.')[0] + '_AI.pdf';
            link.click();

            // Clean up resources
            window.URL.revokeObjectURL(link.href);
            this.toastr.success('File downloaded successfully');

            this.http
              .post(
                `${this.baseUrl}/api/scan/downloadPdfReport`,
                { filePath: this.scanDataId },
                { responseType: 'blob' }
              )
              .subscribe(
                (res: Blob) => {
                  // Create a Blob from the response data
                  const blob = new Blob([res], { type: 'application/pdf' });
                  const link = document.createElement('a');
                  link.href = window.URL.createObjectURL(blob);
                  link.download =
                    this.scanRecord.documentName.split('.')[0] +
                    '_Plagiarism.pdf';
                  link.click();
                  window.URL.revokeObjectURL(link.href);
                  this.toastr.success('File downloaded successfully');
                },
                (error) => {
                  console.error('Error downloading file', error);
                  this.toastr.error('Report not found try again later');
                }
              );
          },

          (error) => {
            console.error('Error downloading file', error);
            this.toastr.error('Report not found try again later');

            // Handle error as needed
          }
        );
    }
    //for AI only
    else if (pdfFor == 'ai') {
      this.http
        .post(
          `${this.baseUrl}/api/scan/downloadPdfReportForAI`,
          { filePath: this.scanDataId },
          { responseType: 'blob' }
        )
        .subscribe(
          (res: Blob) => {
            // Create a Blob from the response data
            const blob = new Blob([res], { type: 'application/pdf' });

            // Create a link element, set its href and download attributes, and simulate a click
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = this.scanDataId;
            link.click();

            // Clean up resources
            window.URL.revokeObjectURL(link.href);
            this.toastr.success('File downloaded successfully');
          },
          (error) => {
            console.error('Error downloading file', error);
            this.toastr.error('Report not found try again later');
          }
        );
    }
  };

  onHelpBtnClick(event: any) {
    console.log('help');
  }

  settingButtonClick: boolean = false;

  ngAfterViewInit() {
    const settingsButton = document.getElementById(
      'cr-properties-settings-button'
    );
    if (settingsButton) {
      settingsButton.addEventListener('click', () => {
        this.toggleSettingsModal();
        setTimeout(() => {
          this.settingButtonClick = false;
        }, 5000);
      });
    }

    // Listen for the modal to open from the third-party library (if possible)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'style'
        ) {
          this.toggleSettingsModal();
          setTimeout(() => {
            this.settingButtonClick = false;
          }, 5000);
        }
      });
    });

    const modalElement = document.getElementById(
      'cr-properties-settings-modal'
    );
    if (modalElement) {
      observer.observe(modalElement, { attributes: true });
    }
  }

  toggleSettingsModal() {
    this.settingButtonClick = !this.settingButtonClick;
  }
}
